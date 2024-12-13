# admin.py
from django.contrib import admin
from .models import User, Category, Product, CartItem, Order, OrderItem, Notification, SupportTicket, WishlistItem, PaymentMethod, ShippingMethod

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Notification)
admin.site.register(SupportTicket)
admin.site.register(WishlistItem)
admin.site.register(PaymentMethod)
admin.site.register(ShippingMethod)
