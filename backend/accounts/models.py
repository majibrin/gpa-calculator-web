from django.db import models
from django.contrib.auth.models import AbstractUser

# --- Custom User Model ---
class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

# --- Course Model ---
class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    course_name = models.CharField(max_length=100)
    credits = models.DecimalField(max_digits=3, decimal_places=1)
    letter_grade = models.CharField(max_length=2)
    semester_year = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Course: {self.course_name}"

    class Meta:
        ordering = ['course_name']

# --- Chat History Model ---
class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    conversation_id = models.CharField(max_length=50, default='default')
    role = models.CharField(max_length=10, choices=[('user', 'User'), ('ai', 'AI')])
    content = models.TextField()
    context = models.CharField(max_length=20, default='general')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"

# --- NEW: Knowledge Base Model ---
class KnowledgeBase(models.Model):
    question = models.TextField(unique=True)
    answer = models.TextField()
    is_verified = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:50]
