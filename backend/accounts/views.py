from rest_framework import generics, permissions, serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .models import User, Course, ChatMessage, KnowledgeBase
from .serializers import CourseSerializer
import uuid
import re

# -------------------------------
# SERIALIZERS
# -------------------------------
class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

# -------------------------------
# REGISTRATION VIEW
# -------------------------------
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Registration failed.'}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        return Response({'success': True, 'user': {'username': user.username, 'email': user.email}}, status=status.HTTP_201_CREATED)

# -------------------------------
# COURSE VIEWSET
# -------------------------------
class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# -------------------------------
# GPA CALCULATION ENDPOINT
# -------------------------------
@api_view(['POST'])
def calculate_gpa_endpoint(request):
    try:
        grades = request.data.get('grades', [])
        credits = request.data.get('credits', [])

        if not grades or not credits or len(grades) != len(credits):
            return Response({'success': False, 'error': 'Invalid data'}, status=400)

        grade_points = {'A':5.0,'B':4.0,'C':3.0,'D':2.0,'E':1.0,'F':0.0}
        total_points = 0
        total_credits = 0

        for grade, credit in zip(grades, credits):
            grade_upper = grade.upper().strip()
            if grade_upper in grade_points:
                total_points += grade_points[grade_upper]*float(credit)
                total_credits += float(credit)

        if total_credits == 0:
            return Response({'success': False, 'error': 'No credits'}, status=400)

        gpa = total_points / total_credits
        classification = "Fail ❌"
        if gpa >= 4.50: classification = "First Class 🥇"
        elif gpa >= 3.50: classification = "Second Class Upper (2:1) 🥈"
        elif gpa >= 2.50: classification = "Second Class Lower (2:2) 🥉"
        elif gpa >= 1.50: classification = "Third Class 📖"
        elif gpa >= 1.00: classification = "Pass Degree 🎯"

        return Response({
            'success': True, 
            'gpa': round(gpa,2),
            'total_credits': total_credits,
            'classification': classification
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# -------------------------------
# CHAT ENDPOINT (Smart Version)
# -------------------------------
@api_view(['POST'])
def chat_message(request):
    try:
        user_message = request.data.get('message', '').strip()
        context = request.data.get('context', 'student')
        session_id = request.data.get('session_id') or str(uuid.uuid4())

        if not user_message:
            return Response({'error': 'Message empty'}, status=400)

        # 1. Identify User
        if request.user.is_authenticated:
            user = request.user
        else:
            user, created = User.objects.get_or_create(
                username=f"guest_{session_id[:8]}",
                defaults={'email': f"{session_id}@thinkora.com"}
            )

        # 2. Save User Message
        ChatMessage.objects.create(
            user=user, conversation_id=session_id, role='user', content=user_message, context=context
        )

        reply = ""
        learned_from_db = False

        # 3. Check Knowledge Base
        kb_entry = KnowledgeBase.objects.filter(question__iexact=user_message).first()
        if not kb_entry and len(user_message) > 10:
             kb_entry = KnowledgeBase.objects.filter(question__icontains=user_message).first()

        if kb_entry:
            reply = kb_entry.answer
            learned_from_db = True

        # 4. Fallback Logic (Regex or Placeholder)
        if not reply:
            if 'gpa' in user_message.lower():
                 reply = "I see you mentioned GPA. Use the GPA Calculator tool for accurate results!"
            else:
                reply = f"I've noted your question: '{user_message}'. I am still learning! An admin will review this soon."

        # 5. Learn (Save unknown questions)
        if not learned_from_db and 'gpa' not in user_message.lower():
            if not KnowledgeBase.objects.filter(question__iexact=user_message).exists():
                KnowledgeBase.objects.create(question=user_message, answer="Pending Answer")

        # 6. Save AI Response
        msg = ChatMessage.objects.create(
            user=user, conversation_id=session_id, role='ai', content=reply, context=context
        )

        return Response({
            'success': True, 
            'reply': reply, 
            'session_id': session_id, 
            'timestamp': msg.created_at.isoformat()
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)

# -------------------------------
# CHAT HISTORY
# -------------------------------
@api_view(['GET'])
def get_chat_history(request):
    try:
        session_id = request.query_params.get('session_id')
        if request.user.is_authenticated:
            user = request.user
            conv_id = None
        elif session_id:
            user = User.objects.filter(username__startswith=f"guest_{session_id[:8]}").first()
            conv_id = session_id
        else:
            return Response({'success': True, 'history':[]})

        if not user:
            return Response({'success': True, 'history':[]})

        messages = ChatMessage.objects.filter(user=user).order_by('created_at')[:50]
        if conv_id:
            messages = messages.filter(conversation_id=conv_id)

        history = [{'id':m.id,'sender':m.role,'text':m.content,'time':m.created_at.isoformat()} for m in messages]
        return Response({'success': True, 'history': history})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# -------------------------------
# UTILS
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def create_superuser(request):
    User = get_user_model()
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')
    if User.objects.filter(email=email).exists():
        return Response({'error':'User exists.'})
    user = User.objects.create_superuser(email=email, username=username, password=password)
    return Response({'success':True,'email':user.email})

@api_view(['GET'])
def health_check(request):
    return Response({'status':'ok'})
