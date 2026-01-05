from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Course, ChatMessage, KnowledgeBase

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'username', 'is_staff', 'is_active')
    ordering = ('email',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_name', 'user', 'letter_grade', 'credits')
    list_filter = ('user',)

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('role', 'user', 'content_preview', 'created_at')
    list_filter = ('role', 'created_at', 'user')
    
    def content_preview(self, obj):
        return obj.content[:50]

@admin.register(KnowledgeBase)
class KnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ('question', 'is_verified', 'created_at')
    search_fields = ('question', 'answer')
    list_filter = ('is_verified',)
