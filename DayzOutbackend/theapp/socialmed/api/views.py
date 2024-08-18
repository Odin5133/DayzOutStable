from rest_framework.viewsets import ModelViewSet
from ..models import User, Profile, UserPosts, FriendRequests
from .serializers import loginInfoSerializer, EditUserSerializer, EditPostSerializer, EditProfileSerializer, signupSerializer, SearchSerializer, MyFriendsSerializer, UserSerializer, ProfileSerializer, PostSerializer, FriendRequestsSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed, APIException, ValidationError
import jwt, datetime
from .authentication import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from rest_framework.authentication import get_authorization_header
from ..middleware.UserDecoder import UserDecoder
from django.utils.decorators import method_decorator
from django.db.models import Count
from rest_framework import generics
from rest_framework.filters import SearchFilter
from django_filters import rest_framework as filters
from django.http import QueryDict
"""
class LoginInfoViewSet(ModelViewSet):
    queryset=User.objects.all() # probably needs changes, since no longer using this model
    serializer_class=loginInfoSerializer # what's the purpose of this class?
"""

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            user = User.objects.filter(username=email).first()
            if user is None:
                raise AuthenticationFailed('User not found!')
            
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        response = Response()
        response.set_cookie(key='refreshToken', value=refresh_token, httponly=True, samesite='None', secure=True)
        response.data = {
            'token': access_token
        }
        return response
    
class UserView(APIView):
    def get(self, request):
        auth = get_authorization_header(request).split()

        if auth and len(auth) == 2:
            token = auth[1].decode('utf-8')
            id = decode_access_token(token)

            user = User.objects.filter(pk=id).first()
            return Response(UserSerializer(user, context = {'request': request}).data)
        raise AuthenticationFailed('Unauthenticated!')

class LogoutView(APIView):
    def post(self, _):
        response = Response()
        response.delete_cookie(key='refreshToken',  samesite='None')
        # response.set_cookie(key='refreshToken', value="", httponly=True, samesite='None', secure=True)
        response.data = {
            'message': 'success'
            
        }
        return response

@method_decorator(UserDecoder, name='dispatch')
class ProfileView(APIView): # needs auth header and other user's username
    def post(self, request, user):
        userobj1 = user
        user2 = None
        user2 = request.data['user2']
        if user2 is None:
            return Response({'message': 'User2s username reception error!'})
        
        try:
            user2rec = User.objects.get(username=user2)
        except User.DoesNotExist:
            return Response({'message': 'User2 does not exist!'})
        #print(user2rec.id)
        #profile2 = Profile.objects.filter(user=user2rec['id'])
        
        profile1 = userobj1.profile
        profile2 = user2rec.profile
        isFriend = None
        isFriend = profile1.isFriend(profile2)
        # print(profile1.id)
        return Response(ProfileSerializer(profile2, context={'request': request,'isFriend': isFriend, 'user': userobj1}).data)
        #to follow
        # request.data.follow == 1?
        #profile1.friendRequest(profile2)

        #to unfollow
        #profile1.unfriend(profile2)

        #to check if following
        # Check if following
        isFriend = profile1.isFriend(profile2)

        return Response({'message': 'follow action done!'})

@method_decorator(UserDecoder, name='dispatch')
class CreatePostView(APIView):
    def post(self, request, user):
        #request.data._mutable = True
        if isinstance(request.data, QueryDict):
            request.data._mutable = True
        request.data['user']=user.id
        #print(request.data)
        serializer = PostSerializer(data=request.data, context={"request": request, "user": user})
        serializer.is_valid(raise_exception=True)
        #print("hmmmm")
        serializer.save()
        return Response(serializer.data)

@method_decorator(UserDecoder, name='dispatch')
class LikePostView(APIView):
    def post(self, request, user):
        flag = request.data["addORremove"]
        postID = request.data["postID"]
        post = UserPosts.objects.get(id=postID)
        print(flag)
        if flag is True:
            if user in post.dislikes.all():
                post.dislikes.remove(user)
            post.likes.add(user)
            return Response({'message': 'Like added!'})
        else:
            if user in post.likes.all():
                post.likes.remove(user)
                return Response({'message': 'Like removed!'})
            return Response({'message': 'User never liked'})

@method_decorator(UserDecoder, name='dispatch')
class DislikePostView(APIView):
    def post(self, request, user):
        flag = request.data["addORremove"]
        postID = request.data["postID"]
        post = UserPosts.objects.get(id=postID)
        if flag is True:
            if user in post.likes.all():
                post.likes.remove(user)
            post.dislikes.add(user)
            return Response({'message': 'DisLike added!'})
        else:
            if user in post.dislikes.all():
                post.dislikes.remove(user)
                return Response({'message': 'DisLike removed!'})
            return Response({'message': 'User never disliked'})

@method_decorator(UserDecoder, name='dispatch')
class SendFriendRequest(APIView):
    def post(self, request, user):
        from_user = user.profile
        user2 = request.data['to_username']

        try:
            user2rec = User.objects.get(username=user2)
        except User.DoesNotExist:
            return Response({'message': 'User2 does not exist!'}) 

        to_user = user2rec.profile
        if to_user.isFriend(from_user):
            return Response({"message": "You are already friends with this user!"}, status=status.HTTP_400_BAD_REQUEST)

        if from_user != to_user:
            friend_request, created = FriendRequests.objects.get_or_create(from_user=from_user, to_user=to_user)
            if created:
                return Response({"message": "Friend request sent"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Cannot send friend request to yourself"}, status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(UserDecoder, name='dispatch')
class AcceptFriendRequest(APIView):
    def post(self, request, user):
        friend_request = FriendRequests.objects.get(id=request.data['request_id'])
        if friend_request.to_user == user.profile:
            friend_request.to_user.friends.add(friend_request.from_user)
            friend_request.from_user.friends.add(friend_request.to_user)
            friend_request.delete()
            return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)
        return Response({"message": "Not authorized to accept this friend request"}, status=status.HTTP_403_FORBIDDEN)

@method_decorator(UserDecoder, name='dispatch')
class DeclineFriendRequest(APIView):
    def post(self, request, user):
        friend_request = FriendRequests.objects.get(id=request.data['request_id'])
        if friend_request.to_user == user.profile:
            friend_request.delete()
            return Response({"message": "Friend request declined"}, status=status.HTTP_200_OK)
        return Response({"message": "Not authorized to decline this friend request"}, status=status.HTTP_403_FORBIDDEN)

@method_decorator(UserDecoder, name='dispatch')
class PendingFriendRequests(APIView):
    def post(self, request, user):
        user_profile = user.profile
        pending_requests = FriendRequests.objects.filter(to_user=user_profile)
        serialized_data = FriendRequestsSerializer(pending_requests, many=True, context={"request": request, "user": user}).data
        return Response(serialized_data)

# mutual friends
@method_decorator(UserDecoder, name='dispatch')
class SuggestedFriends(APIView):
    def post(self, request, user):
        user_profile = user.profile
        myFriends = user_profile.friends.all()
        friend_requests_sent = FriendRequests.objects.filter(from_user=user_profile).values_list('to_user', flat=True)
        friend_requests_received = FriendRequests.objects.filter(to_user=user_profile).values_list('from_user', flat=True)
        profiles_with_requests = list(friend_requests_sent) + list(friend_requests_received)

        suggestedFriends = Profile.objects.filter(friends__in = myFriends).exclude(id__in = myFriends).exclude(id__in = profiles_with_requests).distinct()
        return Response(MyFriendsSerializer(suggestedFriends, many=True, context={'request': request}).data)


@method_decorator(UserDecoder, name='dispatch')
class MyFriends(APIView):
    def post(self, request, user):
        user_profile = user.profile
        return Response(MyFriendsSerializer(user_profile.friends.exclude(user=user).all(), many=True, context={'request': request, "user": user}).data)

@method_decorator(UserDecoder, name='dispatch')    
class Unfriend(APIView):
    def post(self, request, user):
        user_profile = user.profile
        user2 = request.data['friend_username']
        if user.username == user2:
            return Response({'message': 'Cannot unfriend yourself!'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user2rec = User.objects.get(username=user2)
        except User.DoesNotExist:
            return Response({'message': 'User2 does not exist!'}) 
        
        friend_user_profile = user2rec.profile
        user_profile.unfriend(friend_user_profile)
        #friend_user_profile.unfriend(user_profile) #no need due to symmetrical = True
        return Response({'message': 'Successfully unfriended.'})

# @method_decorator(UserDecoder, name='dispatch')
# class ReactPostView(APIView):
#     def post(self, request, user):
#         flag = request.data["likeORdislike"]
#         postID = request.data["postID"]
#         post = UserPosts.objects.get(id=postID)
#         if flag is True:
#             if user in post.likes:
#                 post.likes.remove(user)
#                 return Response({'message': 'Like removed!'})
#             else:
#                 post.likes.add(user)
#                 post.dislikes.remove(user)
#                 return Response({'message': 'Like added!'})
#         else:
#             if user in post.dislikes:
#                 post.dislikes.remove(user)
#                 return Response({'message': 'Disike removed!'})
#             else:
#                 post.dislikes.add(user)
#                 post.likes.remove(user)
#                 return Response({'message': 'Dislike added!'})


#user1 context is used to check if the post has reaction by the user
@method_decorator(UserDecoder, name='dispatch')
class FeedView(APIView):
    def post(self, request, user):
        user_profile = user.profile
        friends = user_profile.friends.all()
        try:
            skip = int(request.data.get('skip', 0))
            limit = int(request.data.get('limit', 10))
        except (TypeError, ValueError):
            raise ValidationError("Invalid 'skip' or 'limit' value.")
    
        # Ensure valid range
        if skip < 0 or limit < 0:
            raise ValidationError("'skip' and 'limit' should be non-negative.")
        all_posts = UserPosts.objects.filter(user__profile__in=friends).order_by('-created_at')
        total_posts = all_posts.count()
        start = min(skip, total_posts)
        end = min(start+limit, total_posts)
        friend_posts = all_posts[start:end]
        return Response(PostSerializer(friend_posts, many=True, context={'request': request, "user": user}).data)


@method_decorator(UserDecoder, name='dispatch')
class EditUsername(APIView):
    def post(self, request, user):
        new_username = request.data['username']
        userRec = None
        userRec = User.objects.filter(username=new_username)
        if userRec.count() > 0:
            return Response({'message': 'Username is already chosen!'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EditUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.username = new_username
        user.save() #new_username must fit all conditions of user field
        return Response({'message': 'Username updated successfully!'}, status=status.HTTP_200_OK)
    
@method_decorator(UserDecoder, name='dispatch')
class EditEmail(APIView):
    def post(self, request, user):
        new_email = request.data['email']
        userRec = None
        userRec = User.objects.filter(email=new_email)
        if userRec.count() > 0:
            return Response({'message': 'An account with this email already exists!'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EditUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.email = new_email
        user.save() # Add verification of new email
        return Response({'message': 'Email updated successfully!'}, status=status.HTTP_200_OK)

#Edit password??

@method_decorator(UserDecoder, name='dispatch')
class EditPassword(APIView):

    def post(self, request, user):
        
        #user = request.user
        old_password = request.data['old_password']
        new_password = request.data['password']
        if not user.check_password(old_password):
            return Response({'message': 'Old password is incorrect!'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EditUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password updated successfully!'}, status=status.HTTP_200_OK)
    

@method_decorator(UserDecoder, name='dispatch')
class EditProfilePic(APIView):
    def post(self, request, user):
        userProfile = get_object_or_404(Profile, user=user)
        if 'profilePic' not in request.FILES:
            return Response({'message': 'No profile picture provided'}, status=status.HTTP_400_BAD_REQUEST)
        userProfile.profilePic = request.FILES['profilePic']
        userProfile.save()
        return Response({'message': 'Profile pic updated successfully!'}, status=status.HTTP_200_OK)

@method_decorator(UserDecoder, name='dispatch')
class EditProfileBanner(APIView):
    def post(self, request, user):
        userProfile = get_object_or_404(Profile, user=user)
        if 'profileBanner' not in request.FILES:
            return Response({'message': 'No profile banner provided'}, status=status.HTTP_400_BAD_REQUEST)
        userProfile.profileBanner = request.FILES['profileBanner']
        userProfile.save()
        return Response({'message': 'Profile banner updated successfully!'}, status=status.HTTP_200_OK)

@method_decorator(UserDecoder, name='dispatch')
class EditProfileBio(APIView):
    def post(self, request, user):
        userProfile = get_object_or_404(Profile, user=user)
        new_bio = request.data['bio']
        serializer = EditProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        userProfile.bio = new_bio
        userProfile.save()
        return Response({'message': 'Profile bio updated successfully!'}, status=status.HTTP_200_OK)

@method_decorator(UserDecoder, name='dispatch')
class EditPostTitle(APIView):
    def post(self, request, user):
        post_ID = request.data['post_ID']
        new_title = request.data['title']
        userPost = get_object_or_404(UserPosts, pk=post_ID)
        if userPost.user != user:
            return Response({'message': 'Not authorized to edit this post!'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EditPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        userPost.title = new_title
        userPost.save()
        return Response({'message': 'Post title updated successfully!'}, status=status.HTTP_200_OK)

@method_decorator(UserDecoder, name='dispatch')
class EditPostBody(APIView):
    def post(self, request, user):
        post_ID = request.data['post_ID']
        new_body = request.data['body']
        userPost = get_object_or_404(UserPosts, pk=post_ID)
        if userPost.user != user:
            return Response({'message': 'Not authorized to edit this post!'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EditPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        userPost.body = new_body
        userPost.save()
        return Response({'message': 'Post body updated successfully!'}, status=status.HTTP_200_OK)

@method_decorator(UserDecoder, name='dispatch')
class EditPostImage(APIView):
    def post(self, request, user):
        post_ID = request.data['post_ID']

        if 'new_postpic' not in request.FILES:
            return Response({'message': 'No post image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        userPost = get_object_or_404(UserPosts, pk=post_ID)
        if userPost.user != user:
            return Response({'message': 'Not authorized to edit this post!'}, status=status.HTTP_403_FORBIDDEN)
        
        userPost.image = request.FILES['new_postpic']
        userPost.save()
        return Response({'message': 'Post image updated successfully!'}, status=status.HTTP_200_OK)

@method_decorator(UserDecoder, name='dispatch')
class DeletePost(APIView):
    def post(self, request, user):
        post_ID = request.data['post_ID']
        userPost = get_object_or_404(UserPosts, pk=post_ID)
        if userPost.user != user:
            return Response({'message': 'Not authorized to delete this post!'}, status=status.HTTP_403_FORBIDDEN)
        userPost.delete()
        return Response({'message': 'Post deleted successfully!'}, status=status.HTTP_200_OK)

@method_decorator(UserDecoder, name='dispatch')
class SearchUserDropdown(APIView):
    def post(self, request, user):
        userField = request.data['userField']
        usernames = User.objects.filter(username__istartswith = userField).exclude(username=user.username).annotate(friend_count = Count('profile__friends')).order_by('-friend_count')
        #usernames_list = usernames.values_list(usernames, flat=True)
        return Response(SearchSerializer(usernames[:5], many=True).data)

@method_decorator(UserDecoder, name='dispatch')
class PostSearchView(generics.ListAPIView):
    serializer_class = PostSerializer
    filter_backends = (SearchFilter,)
    search_fields = ['title','body','nsfw','community']
    #permission_classes = [IsAuthenticated] no need cuz custom authentication
    def get_queryset(self):
        user_profile = self.user.profile
        friends_ids = user_profile.friends.values_list('user_id', flat=True)
        
        # Filter posts created by friends
        queryset = UserPosts.objects.filter(user__id__in=friends_ids).order_by('-created_at')

        return queryset

class RefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refreshToken')
        #print(refresh_token)
        id = decode_refresh_token(refresh_token) # raises exception if cookie expired
        access_token = create_access_token(id)
        return Response({
            'token': access_token
        })
"""@api_view(['POST'])
def verify(request):
    if(request.method == 'POST'):
        serializer = loginInfoSerializer(data=request.data)
        if serializer.is_valid():
            user = request.data.get('username')
            userobj = None
            userobj = loginInfo.objects.filter(username=user).first()
            if userobj is not None: 
                passw = request.data.get('password')
                if userobj.password == passw:
                    return Response({'message': 'success'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'incorrectPassword'}, status=status.HTTP_200_OK)
            return Response({'message': 'userNotFound'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status= status.HTTP_405_METHOD_NOT_ALLOWED)
    # return Response({'message': 'Incorrect Password'}, status=status.HTTP_400_BAD_REQUEST)
    #     return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)"""

"""@api_view(['POST'])
def signup(request):
    if(request.method == 'POST'):
        serializer = signupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'userCreated'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status= status.HTTP_405_METHOD_NOT_ALLOWED)""" # found a better way for authentication


"""
@api_view(['POST'])
def signup_view(request):
    if(request.method == 'POST'):
        form = UserCreationForm(request.POST)
        if form.is_valid():
            login(request, form.save())
            return Response({'message': 'userCreated'}, status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status= status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def login_view(request):
    if(request.method == 'POST'):
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return Response({'message': 'success'}, status=status.HTTP_200_OK)
        return Response(form.errors, status=status.HTTP_200_OK)
    return Response(status= status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def logout_view(request):
    if(request.method == 'POST'):
        logout(request)


        """