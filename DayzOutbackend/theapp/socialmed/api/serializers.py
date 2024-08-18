from rest_framework import serializers
from ..models import User, Profile, UserPosts, ImageOrVideo, FriendRequests
from rest_framework.validators import UniqueValidator
from django.conf import settings
from rest_framework.exceptions import ValidationError

class loginInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')

class signupSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {
            'username' : {'unique': True},
        }

class EditProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'profilePic', 'profileBanner']
        extra_kwargs = {
            'bio': {'required': False},
            'profilePic': {'required': False},
            'profileBanner': {'required': False},
        }

class EditPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPosts
        fields = ['title', 'body', 'image']
        extra_kwargs = {
            'title': {'required': False},
            'body': {'required': False},
            'image': {'required': False},
        }

class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
            'email': {'required': False},
        }
    


class UserSerializer(serializers.ModelSerializer):
    userPic = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username','email', 'password', 'userPic']
        extra_kwargs = {
            'password': {'write_only': True},
            'userPic': {'required': False}
        }
    
    def get_userPic(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.profile.profilePic.url)
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class FriendRequestsSerializer(serializers.ModelSerializer):
    from_user_username = serializers.CharField(source='from_user.user.username', read_only=True)
    # from_user_pic = serializers.ImageField(source='from_user.profilePic', read_only=True)
    from_user_pic = serializers.SerializerMethodField()
    class Meta:
        model = FriendRequests
        fields = ['id', 'from_user', 'to_user', 'timestamp', 'from_user_username','from_user_pic']

    def get_from_user_pic(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.from_user.profilePic.url)

class PostSerializer(serializers.ModelSerializer):
    likesCount = serializers.SerializerMethodField()
    dislikesCount = serializers.SerializerMethodField()
    userReacted = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    userpic = serializers.SerializerMethodField()
    #imageUrl = serializers.SerializerMethodField()
    class Meta:
        model = UserPosts
        fields = ['id', 'user', 'userpic','username', 'title', 'image', 'community', 'nsfw', 'body', 'created_at', 'likesCount', 'dislikesCount', 'imgorvid', 'userReacted']
        extra_kwargs = {'user': {'write_only': True}}

    def get_username(self, obj):
        return obj.user.username
    
    def get_userpic(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.user.profile.profilePic.url)
        #return obj.user.profile.profilePic
    
    def get_likesCount(self, obj):
        return obj.likes_count()

    def get_dislikesCount(self, obj):
        return obj.dislikes_count()

    def get_userReacted(self, obj):
        user = self.context.get('user')
        if obj.likes.filter(id=user.id).exists():
            return 1
        elif obj.dislikes.filter(id=user.id).exists():
            return 2
        else:
            return 0

    # def get_imageUrl(self, obj):
    #     createBool = self.context['create']
    #     if createBool is True:
    #         return self.image
    #     if obj.image:
    #         request = self.context.get('request')
    #         return request.build_absolute_uri(obj.image.url)
    #     return None


class MyFriendsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    userPic = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['username','bio','userPic']
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_userPic(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.user.profile.profilePic.url)
        #return obj.user.profile.profilePic

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    myfriends = serializers.SerializerMethodField()
    myposts = serializers.SerializerMethodField()
    isFriend = serializers.SerializerMethodField()
    sentRequest = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['username','bio','profilePic','profileBanner','myfriends', 'myposts', 'isFriend', 'sentRequest']
        #extra_kwargs = {'sentRequest': {'required': False}}
        
    def get_sentRequest(self, obj):
        user = self.context.get('user')
        user_profile = user.profile
        flag = None
        flag = FriendRequests.objects.filter(to_user = obj.user.profile, from_user = user_profile).first()
        if flag is None:
            return False
        return True
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_myfriends(self, obj):
        return obj.friendCount()
    
    def get_isFriend(self, obj):
        user = self.context.get('user')
        user_profile = user.profile
        if user_profile.isFriend(obj.user.profile):   
            return True
        return False
    
    def get_myposts(self, obj):
        isFriend = self.context.get('isFriend', False)
        if isFriend:
            user_posts = UserPosts.objects.filter(user=obj.user).order_by('-created_at')
            return PostSerializer(user_posts, many=True, context={'request': self.context.get('request'), 'user': self.context.get('user')}).data
        return None  # Or an empty list if preferred: return []