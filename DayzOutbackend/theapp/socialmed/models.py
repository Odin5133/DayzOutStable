from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.db.models.signals import post_save # Recommended to make a separate signals.py file, but change app config
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.conf import settings
from django_rest_passwordreset.signals import reset_password_token_created
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
import os

MYWEBSITETITLE = "DayzOut"

DEFAULT_PROFILE_PIC = "profilepics/samurai.jpg"
DEFAULT_PROFILE_BANNER = "profilebanners/arthurpfp.jpeg"
DEFAULT_POSTS_IMAGE = "profilebanners/arthurpfp.jpeg"

class CaseInsensitiveUserManager(UserManager):
    def get(self, **kwargs):
        if 'username' in kwargs:
            kwargs['username__iexact'] = kwargs.pop('username')
        if 'email' in kwargs:
            kwargs['email__iexact'] = kwargs.pop('email')
        return super().get(**kwargs)
    
    def filter(self, *args, **kwargs):
        if 'username' in kwargs:
            kwargs['username__iexact'] = kwargs.pop('username')
        if 'email' in kwargs:
            kwargs['email__iexact'] = kwargs.pop('email')
        return super().filter(*args, **kwargs)


# all users have django admin privileges, need to change that
class User(AbstractUser):
    username = models.CharField(max_length=16, unique=True)
    id = models.BigAutoField(primary_key=True, verbose_name="ID")
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=18)

    objects = CaseInsensitiveUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        self.username = self.username.lower()
        self.email = self.email.lower()
        super(User, self).save(*args, **kwargs)
    
    @receiver(reset_password_token_created)
    def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
        """
        Handles password reset tokens
        When a token is created, an e-mail needs to be sent to the user
        :param sender: View Class that sent the signal
        :param instance: View Instance that sent the signal
        :param reset_password_token: Token Model Object
        :param args:
        :param kwargs:
        :return:
        """
        # send an e-mail to the user
        #print(reset_password_token.user.email)
        context = {
            'current_user': reset_password_token.user,
            'username': reset_password_token.user.username,
            'email': reset_password_token.user.email,
            'MYWEBSITETITLE': MYWEBSITETITLE,
            'expiry': settings.DJANGO_REST_MULTITOKENAUTH_RESET_TOKEN_EXPIRY_TIME,
            # 'reset_password_url': "{}?token={}".format(
            #     instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            #     reset_password_token.key
            # )
            'token': reset_password_token.key
        }   
        print(settings.BASE_DIR)
        template_path_html = 'user_reset_password.html'
        template_path_txt = 'user_reset_password.txt'
        email_html_message = render_to_string(template_path_html, context)  
        email_plaintext_message = render_to_string(template_path_txt, context) 

        msg = EmailMultiAlternatives(
            "Password reset for {title}".format(title=MYWEBSITETITLE), #title
            email_plaintext_message, #msg
            settings.DEFAULT_FROM_EMAIL, #from
            [reset_password_token.user.email] #to
        ) 
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()



        

class ImageOrVideo(models.IntegerChoices):
    NoFile = 0, 'NoFile'
    ImageFile = 1, 'Image'
    VideoFile = 2, 'Video'

class UserPosts(models.Model):
    user = models.ForeignKey(
        User, related_name="posts", on_delete=models.DO_NOTHING
    )
    title = models.CharField(max_length=50, default="DayzOutTitle")
    image = models.FileField(upload_to="postpics/", default=None, blank=True)
    imgorvid = models.IntegerField(choices=ImageOrVideo.choices, default=ImageOrVideo.NoFile)
    community = models.CharField(max_length=32, default="DayzOutGang")
    nsfw = models.BooleanField(default=False)
    body = models.CharField(max_length=140)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    dislikes = models.ManyToManyField(User, related_name="disliked_posts", blank=True)
    
    def likes_count(self):
        return self.likes.count()

    def dislikes_count(self):
        return self.dislikes.count()
    
    def save(self, *args, **kwargs):
        if self.image:
            if self.image.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                self.imgorvid = ImageOrVideo.ImageFile
            elif self.image.name.lower().endswith(('.mp4', '.mov', '.avi', '.wmv')):
                self.imgorvid = ImageOrVideo.VideoFile
            else:
                raise ValidationError("Unsupported file type.")
        else:
            self.imgorvid = ImageOrVideo.NoFile
        #print(self.imgorvid)
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.user} "
            f"({self.created_at:%Y-%m-%d %H:%M}): "
            f"{self.body[:30]}..."
        )
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profilePic = models.ImageField(upload_to="profilepics/", default=DEFAULT_PROFILE_PIC, blank=True)
    profileBanner = models.ImageField(upload_to="profilebanners/", default=DEFAULT_PROFILE_BANNER, blank=True)
    bio = models.CharField(max_length=50, default="Your bio here")

    friends = models.ManyToManyField(
        "self",
        #related_name="followed_by", 
        symmetrical=True, # set True if Friends
        blank=True
    )

    def friendRequest(self, profile):
        """Follow a profile."""
        if profile != self and not self.isFriend(profile):
            self.friends.add(profile)
            self.save()

    def unfriend(self, profile):
        """Unfollow a profile."""
        if self.isFriend(profile):
            self.friends.remove(profile)
            self.save()

    def isFriend(self, profile):
        """Check if following a profile."""
        return self.friends.filter(id=profile.id).exists()
    
    def friendCount(self):
        """Get the count of profiles this profile is following."""
        return self.friends.count()-1
    
    def __str__(self):
        return self.user.email
    
@receiver(post_save, sender=User)
def createProfile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()
        #user_profile.follows.set([instance.profile.id]) # for multiple
        user_profile.friends.add(instance.profile) # for single
        user_profile.friends.add(5)
        user_profile.save()

class FriendRequests(models.Model):
    from_user = models.ForeignKey(Profile, related_name='from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(Profile, related_name='to_user', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} to {self.to_user}"



# don't neeed this, thanks to receiver: post_save.connect(createProfile, sender=User)