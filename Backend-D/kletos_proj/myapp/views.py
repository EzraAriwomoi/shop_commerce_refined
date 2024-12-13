import json
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from .models import User, CartItem, Product, WishlistItem
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def sign_in(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Log the incoming data for debugging
        print(f"Received email: {email}, password: {password}")

        # Authenticate the user using the provided credentials
        user = authenticate(request, email=email, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Sign-in successful',
                'access_token': token.key
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def add_to_cart(self, request):
        try:
            data = request.data
            product_id = data.get("product_id")
            quantity = data.get("quantity", 1)

            product = Product.objects.get(id=product_id)

            cart_item, created = CartItem.objects.get_or_create(
                user=request.user, product=product, defaults={"quantity": quantity}
            )
            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return Response({"message": "Product added to cart successfully."}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_wishlist(self, request, pk=None):
        """
        Add or remove a product from the wishlist for the authenticated user.
        """
        try:
            product = Product.objects.get(id=pk)

            wishlist_item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)

            if not created:
                wishlist_item.delete()
                return Response({"message": "Product removed from wishlist."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Product added to wishlist."}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def check_wishlist_status(self, request, pk=None):
        try:
            product = Product.objects.get(id=pk)

            exists = WishlistItem.objects.filter(user=request.user, product=product).exists()
            return Response({"exists": exists}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

class AuthStatusView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'authenticated': True}, status=200)

