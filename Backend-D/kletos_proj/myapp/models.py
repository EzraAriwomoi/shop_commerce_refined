from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils.timezone import now


# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, full_name, password, **extra_fields)


# User model
class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=256)
    created_at = models.DateTimeField(default=now)
    is_blocked = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    phone = models.CharField(max_length=10, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    mpesa_number = models.CharField(max_length=50, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",
        blank=True,
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    # REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email


# Category model
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Product model
class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField()
    stock = models.IntegerField()
    image_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(default=now)
    is_featured = models.BooleanField(default=False)
    featured_priority = models.IntegerField(null=True, blank=True)
    categories = models.ManyToManyField(Category, related_name="products")

    def __str__(self):
        return self.name


# CartItem model
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="carts")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.IntegerField()
    created_at = models.DateTimeField(default=now)

    class Meta:
        unique_together = ("user", "product")


# Order model
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_price = models.FloatField()
    status = models.CharField(max_length=50, default="Pending")
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"Order {self.id} - {self.user.email}"


# OrderItem model
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_items")
    quantity = models.IntegerField()

    class Meta:
        unique_together = ("order", "product")


# Notification model
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=100)
    message = models.TextField()
    type = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.title


# SupportTicket model
class SupportTicket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="support_tickets")
    subject = models.CharField(max_length=100)
    message = models.TextField()
    status = models.CharField(max_length=50, default="Open")
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.subject


# WishlistItem model
class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlists")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlist_items")
    created_at = models.DateTimeField(default=now)

    class Meta:
        unique_together = ("user", "product")


# PaymentMethod model
class PaymentMethod(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# ShippingMethod model
class ShippingMethod(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
