from datetime import datetime, timedelta
from random import randint
from flask import app
from werkzeug.security import generate_password_hash
from app.models import (
    Category, User, Product, CartItem, Order, OrderItem, Notification,
    SupportTicket, WishlistItem, PaymentMethod, ShippingMethod,
    FAQ, ContactQuery, Banner, FeaturedProduct
)
from app import create_app, db

app = create_app()

def populate_database():
    # Drop all tables
    db.drop_all()
    db.create_all()

    # Create categories
    categories = [
        Category(name='African Print fans', description='Various types of African fans'),
        Category(name='Artifacts', description='Various types of Artifacts'),
        Category(name='Bags and mats', description='Various types of Bags and mats'),
        Category(name='Bracelets', description='Various types of Bracelets'),
        Category(name='Brass chockers', description='Various types of Brass chockers'),
        Category(name='Brass necklaces', description='Various types of Brass necklaces'),
        Category(name='Calabashes', description='Various types of Calabashes'),
        Category(name='Shields', description='Various types of Shields'),
        Category(name='Wood carvings and sculptures', description='Various types of Wood carvings and sculptures'),
    ]
    db.session.add_all(categories)
    db.session.commit()

    # Create users
    users = [
        User(full_name='Alice Smith', email='alice@example.com', password=generate_password_hash('password')),
        User(full_name='Bob Johnson', email='bob@example.com', password=generate_password_hash('password')),
        User(full_name='Charlie Lee', email='charlie@example.com', password=generate_password_hash('password')),
        User(full_name='Diana Green', email='diana@example.com', password=generate_password_hash('password'))
    ]
    db.session.add_all(users)
    db.session.commit()

    # Create products and associate them with categories
    image_urls = [
        # African Print Fan urls image
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F1.jpg?alt=media&token=ca9edc2a-26a7-41c0-b7a1-9aafc8ebb9c7",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F2.jpg?alt=media&token=74d83fb0-8ef8-4556-bcc1-45d1acf8f735",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F3.jpg?alt=media&token=8fd55900-a839-4781-8f99-e0eea6a723ef",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F4.jpg?alt=media&token=32a8112e-62a8-4ceb-87c8-c100d6d3fbdb",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F5.jpg?alt=media&token=8484f3fe-b804-4112-9d20-1e5fd82a354b",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F6.jpg?alt=media&token=f24ef64e-f51f-4251-a73e-4f9869f8cf44",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F7.jpg?alt=media&token=f2313dc7-f5ff-49c1-8c76-f97587bdda34",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F8.jpg?alt=media&token=3dd946ec-1c85-4784-9802-3f7d36970bb2",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/African%20Print%20fans%2F9.jpg?alt=media&token=99a35f77-d1ff-4a07-9cc6-f3f182be9ca0",

        # Artifacts
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FAfrican%20stool%20made%20from%20hard%20wood%20(available%20in%20various%20sizes)%20-%209%2C000.jpg?alt=media&token=5d95deee-a340-4b07-9d60-1358a6ef618f",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FAfrican%20woman%20-%203%2C000.jpg?alt=media&token=2df1c705-5a01-426d-bda1-c84c3995977e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FAfrican%20woman%20and%20child%20-%203%2C100.jpg?alt=media&token=ae555dfe-d2aa-442e-a0e7-77d5a9225b1b",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FAfrican%20woman%20carrying%20her%20child%20-%203%2C000.jpg?alt=media&token=3a9ce46b-e3f5-4124-a1f0-15048881bad8",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FGorilla-inspired%20wine%20holder%20-%202%2C500.jpg?alt=media&token=59b6c8a2-96bf-4b6c-a366-aa325e6f9cab",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FLantern%20made%20from%20papyrus%20drawn%20from%20Kenya%20rivers%20-%203%2C300.jpg?alt=media&token=de9dd32d-3727-4149-9a59-a9dcce963497",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FLion%20head%20carved%20out%20from%20the%20softwoods%20of%20Mount%20Kenya-%2012%2C000.jpg?alt=media&token=45ee69e3-2558-4b62-82d8-666a82d3fbf4",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Artifacts%2FZebra%20head%20carbed%20out%20from%20the%20soft%20woods%20of%20Mount%20Kenya-%209%2C000.jpg?alt=media&token=373aa440-07f8-40cb-be33-27a3c1688f5c",

        # Bags and mats
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F1%2C000%20a%20piece.jpg?alt=media&token=913bfe05-0c2c-46bf-a2e6-7214413e631f",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C000.jpg?alt=media&token=8fa13518-c14b-441e-b749-67389099f7b5",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C050.jpg?alt=media&token=0e3c9928-88ee-452f-85b2-c01873cd834e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C100.jpg?alt=media&token=4a86cf0e-8232-4ae7-b391-8dba952cc911",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C200.jpg?alt=media&token=30b4d665-44f7-42e4-9f91-d07691930b99",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C500.jpg?alt=media&token=076f7c4b-9faa-48ed-b7c2-93eab95a314d",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C700.jpg?alt=media&token=7103515d-71c0-4a66-9a4a-0e71cfff9933",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C750.jpg?alt=media&token=c548bf8b-bde4-42c8-8329-a696783edf2c",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2F3%2C800.jpg?alt=media&token=85175cd3-a83c-4989-8dc6-4f157f7d8770",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2FDog%20house%20-%2013%2C000.jpg?alt=media&token=2302ec1d-56bc-4d64-9692-6b988d14a892",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2FDog%20house%20-%2013%2C500.jpg?alt=media&token=91be1d8c-e7d4-42f4-b194-386b02c3adec",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bags%20and%20mats%2FDog%20house-%2011%2C000.jpg?alt=media&token=0a82d4d6-b6a4-4328-9565-eb7db14562de",

        # Bracelets
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice1200%2F17.jpg?alt=media&token=71b481e8-b824-4263-a4d7-89a78f558a59",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice1200%2F18.jpg?alt=media&token=5f01e7c2-40d8-419a-aff3-5e10bfe63250",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice1200%2F20.jpg?alt=media&token=156b1263-09d7-48c0-82cb-1f36b7d9e56f",

        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2000%2F12.jpg?alt=media&token=77480224-4e61-47a2-bd36-591ce2ab37d0",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2000%2F21.jpg?alt=media&token=abad4250-9351-44e3-979a-77f3378a69cd",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2000%2F22.jpg?alt=media&token=79b2c9bf-5c62-4180-a3e4-5a81b7e66ea9",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2000%2F23.jpg?alt=media&token=e4b75387-bbd7-40cb-ae0a-98f653e71247",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2000%2F25.jpg?alt=media&token=2b98f1a5-dc6f-4059-b81b-e18222096f07",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2000%2F26.jpg?alt=media&token=e07fcd34-bf3b-4607-a517-c0fce81f4542",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2000%2F27.jpg?alt=media&token=fa654ede-be2d-469a-85c4-d7e41eea540d",

        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F10.jpg?alt=media&token=d812602d-5e7d-4012-8d55-c606695f4b83",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F11.jpg?alt=media&token=96e21ac3-d940-481f-8e85-65db3c487c30",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F13.jpg?alt=media&token=9364aeec-2edd-4497-88d3-58d710a5ae3d",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F14.jpg?alt=media&token=ed255e84-1d3a-4c4f-ae67-7208034f0af2",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F15.jpg?alt=media&token=f643eddb-83c6-4627-a367-3eddec0317f9",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F16.jpg?alt=media&token=7222e906-ed2c-4c8d-85a7-c57ba091689c",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F2.jpg?alt=media&token=4642e0eb-a191-4be7-8b10-20884a43e1e8",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F28.jpg?alt=media&token=35762e4d-4c5a-4aee-81b9-bccfeca73680",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F3.jpg?alt=media&token=b7abaf59-0b16-4bdb-a3ad-5587519effa7",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F4.jpg?alt=media&token=2808800c-133d-4548-8c71-009fc5dfcca6",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F5.jpg?alt=media&token=ae6443e9-1a9b-4712-9afb-92c9f6f7f576",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F7.jpg?alt=media&token=ba8f96d4-02cb-4128-875b-1ccce202f9ef",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Bracelets%2Fprice2500%2F8.jpg?alt=media&token=0e0d8086-265d-4f11-bdee-d119353473aa",

        # Brass chockers
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F25.jpg?alt=media&token=cfcfaf61-2bf0-4f23-8562-6b2b8c9c5677",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F26.jpg?alt=media&token=9e1eb202-caa1-469a-b5e4-3e09e52cd3c7",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F28.jpg?alt=media&token=c0c5618b-e3f2-4a4b-84c9-775cce3dbae6",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F29.jpg?alt=media&token=55aa1c97-05e9-4649-b7de-824da6dd9d3e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F30.jpg?alt=media&token=bb33ca0e-e9ea-4ff7-a394-e130d81f537b",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F31.jpg?alt=media&token=525b04ed-4fd3-4456-9ac7-558028ab11c7",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F32.jpg?alt=media&token=70e62866-0641-402d-95d4-e7d65487eefb",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F33.jpg?alt=media&token=577d4595-07e4-4237-9b10-c811dd283f35",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F35.jpg?alt=media&token=c8d6f1ce-954e-418f-b76f-93e20ceaf611",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F36.jpg?alt=media&token=c4b8a97e-cbe4-470c-b408-e8bc4b0511fe",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F37.jpg?alt=media&token=12a5ca64-1bd8-4686-8963-bff59c69542c",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F38.jpg?alt=media&token=c41b8587-313e-4c43-8547-80255b716a75",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F39.jpg?alt=media&token=fbdba793-af1f-4e63-8cee-5f158090432b",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F40.jpg?alt=media&token=46c0d2a8-cd24-4aa5-8f99-f4ec9864232a",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F41.jpg?alt=media&token=b000e5f3-b49c-4b0a-8818-814a6f8a3c65",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F42.jpg?alt=media&token=491b2c61-fba3-447a-beb0-5137f94e896c",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F43.jpg?alt=media&token=b4bf11c3-ce11-4dc5-828e-38c6465e24ee",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F44.jpg?alt=media&token=07b931b8-1f5f-4d6c-836a-502a353706b0",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F45.jpg?alt=media&token=48b9fccc-6b91-4823-923b-cf2d915f8293",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F46.jpg?alt=media&token=efde5bf8-8040-4a88-a373-6e931cebae8e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F47.jpg?alt=media&token=49aa1dbb-3219-4f3c-bc7c-434cb0d4a818",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F48.jpg?alt=media&token=854227cc-d13d-4ba4-b4e2-36abfe309daa",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F49.jpg?alt=media&token=4e57f811-b6bc-4d1d-b5e0-d057a5b07d7b",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3000%2F51.jpg?alt=media&token=acf94e88-75fd-4ece-a323-feed91cbfc24",

        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F10.jpg?alt=media&token=fe9c1c93-3355-4469-bdb1-3b33de2c480f",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F11.jpg?alt=media&token=8ff20076-9a2b-4c00-819f-3ea4f086552b",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F12.jpg?alt=media&token=c84dc845-fe8b-46bc-be1b-32884f3b55e2",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F18.jpg?alt=media&token=d0147a0d-0530-4ce9-a7a3-5e9c96ecfce2",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F22.jpg?alt=media&token=cf777791-87d4-4fed-a7ba-f394145acba7",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F23.jpg?alt=media&token=20fa2007-e63f-438f-968f-d8112c56468a",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F24.jpg?alt=media&token=3e80edba-d73d-43c4-8d01-1dae47b9b7a8",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F27.jpg?alt=media&token=638d4c93-fc66-4ecc-ba2f-2882767686ac",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F34.jpg?alt=media&token=336095db-d845-43e4-9e4c-6bf9868456d2",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F50.jpg?alt=media&token=4156c99b-ecc7-48de-b517-dc705da70ba2",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F7.jpg?alt=media&token=32d17cb9-c350-4ad2-b61a-ab2b96d27df4",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F8.jpg?alt=media&token=d04e84cb-3c56-44a5-9da5-ebe445a26f1a",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3500%2F9.jpg?alt=media&token=4b5f7351-9952-4d9b-b9c3-52a529824bb6",

        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F1.jpg?alt=media&token=ee55ab1d-0f1e-4a1a-aa8b-97e434398452",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F13.jpg?alt=media&token=aaffefa8-04e1-4ab1-912a-b7c7a4c058fd",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F14.jpg?alt=media&token=0492695e-3e1f-4232-b5d0-08ed8df5a2e1",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F15.jpg?alt=media&token=593818b4-bb11-40dc-801f-8b1d3f776f6a",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F16.jpg?alt=media&token=89785599-3bd1-450e-8fe8-e723cf28758e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F17.jpg?alt=media&token=8698863c-1d42-46c3-a453-ce72a1899a1e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F19.jpg?alt=media&token=4895b1a3-b6d8-46b9-b38d-40c5b92e7ff0",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F2.jpg?alt=media&token=072154f7-138d-4ff3-aeca-d7fb5cb09ba3",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F20.jpg?alt=media&token=3711833d-64ce-4574-9a07-4615f55fb507",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F21.jpg?alt=media&token=46c1dfed-c42b-425c-9d81-78e51ee5acaf",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F3.jpg?alt=media&token=bfca6687-ff5c-4e0a-ae67-a5c05a49a63c",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F4.jpg?alt=media&token=964dc41f-b597-4501-bcc4-487e758f2324",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F5.jpg?alt=media&token=d76fb9fe-5f25-463b-bf5b-1cfc15c7854c",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F52.jpg?alt=media&token=03489745-01f5-4ad4-a4bc-5d8944959916",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20chockers%2Fprice3800%2F6.jpg?alt=media&token=5fbecf53-6404-4307-8146-a3c02b7ff230",

        # Brass necklaces
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20necklaces%2F1.jpg?alt=media&token=138b9589-4cd4-4b26-abcc-e420e583fbb7",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20necklaces%2F2.jpg?alt=media&token=b4881c36-b6df-4362-b276-4b5455420be8",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20necklaces%2F3.jpg?alt=media&token=98770a82-8513-4ab1-b2bc-3949b2790b61",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Brass%20necklaces%2F4.jpg?alt=media&token=7036d3c5-c521-499c-beb3-c5b920022bba",

        # Calabashes
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice3000%2F1.jpg?alt=media&token=56ee6d74-3476-4153-9e6f-cdf3890bf31e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice3000%2F6.jpg?alt=media&token=79a74b26-b816-4da5-99fb-bb7d38a6b8c9",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice3000%2F7.jpg?alt=media&token=366def45-244a-440a-a187-3785c8cb8930",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice3000%2F8.jpg?alt=media&token=8b978048-1d86-4721-911c-a5289f9bbadc",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice3000%2F9.jpg?alt=media&token=34d89853-d176-4a8a-b931-ee4c76ca62aa",

        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice5000%2F4.jpg?alt=media&token=02d198e7-582f-4fcc-9fca-c3b702cb070d",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice5000%2F5.jpg?alt=media&token=9297eb2a-c521-4d78-88dd-b63131fb2b22",

        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice6500%2F10.jpg?alt=media&token=c1696517-e1c9-4236-8310-e4f7a06db04e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice6500%2F2.jpg?alt=media&token=142776c7-5486-4421-b743-3d4d275fc56f",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Calabashes%2Fprice6500%2F3.jpg?alt=media&token=ed7984a5-2061-4da6-9e9a-f653eddf9d06",

        # Shields
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Shields%2F1.jpg?alt=media&token=73bad88d-bbf8-4bd2-82b0-0fd60b27d302",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Shields%2F2.jpg?alt=media&token=2e75dbcd-7d9c-4c16-ad99-f8ebee4b58dd",

        # Wood carvings and sculptures
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F12%2C000.jpg?alt=media&token=c7854aa2-b3b9-4a4a-8257-64f2b2eeb2df",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F15%2C000.jpg?alt=media&token=98f3adc3-f6cf-4402-9ce1-4dcae51479c8",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F20%2C000.jpg?alt=media&token=5144db98-7613-4795-9a88-761a93864191",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F21%2C000.jpg?alt=media&token=0dbed63e-3b00-4d4c-b3d4-125b06508b58",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F21%2C500.jpg?alt=media&token=34fd4a23-27e5-4f52-b1c6-8f3921acd3ad",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F22%2C400.jpg?alt=media&token=1ffbc245-38b1-4f44-89ec-8df09ebf65ac",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F22%2C450.jpg?alt=media&token=e3cf7c77-4d82-4869-90b2-46afd862a7cf",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F22%2C500.jpg?alt=media&token=fc81d448-ffcf-44b3-8616-e5c6b4f3199b",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F23%2C000.jpg?alt=media&token=996a0ac0-b1b2-4f28-9600-88a63d1f4f82",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F26%2C000.jpg?alt=media&token=fd795e17-7149-4146-8f7d-b6f64999452f",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F27%2C000.jpg?alt=media&token=533df368-ddf5-4df9-a326-af8cc9ebd868",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F28%2C000.jpg?alt=media&token=4593c5b3-ef42-4302-8708-78562b7eb467",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F45%2C000.jpg?alt=media&token=5cea8a89-39b6-4b6a-abee-0d7b6ea3da44",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F49%2C000.jpg?alt=media&token=ee4b5f2b-fe2e-4a21-b919-8a2f6a36bf30",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F55%2C000.jpg?alt=media&token=9407a352-a6cf-40f1-a7ac-3597cd07edbb",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F7%2C000.jpg?alt=media&token=40a13d76-f13e-46c4-94ca-9cbb67a8f65e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F7%2C100.jpg?alt=media&token=a313c0ea-0de0-46ac-8c5c-a2b19b382cbf",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F7%2C200.jpg?alt=media&token=6058a760-452c-45d5-8c69-85b6a2fa4f03",
        "https://firebasestorage.googleapis.com/v0/b/kletos-16f7b.appspot.com/o/Wood%20carvings%20and%20sculptures%2F8%2C000.jpg?alt=media&token=04e5ccd4-11dd-4c1c-b1e3-36b28f8af050",
    ]

    
    products = [
    # African Print Fan 
        Product(name='African Print Fan 1', description='Add a touch of culture to your space with this vibrant African print fan, showcasing intricate patterns and lively colors.', price=2500, stock=10, image_url=image_urls[0], is_featured=True, featured_priority=1, categories=[categories[0]]),
        Product(name='African Print Fan 2', description='Elevate your decor with this elegant African print fan, designed with sophisticated patterns and a chic style.', price=2500, stock=15, image_url=image_urls[1], is_featured=True, featured_priority=2, categories=[categories[0]]),
        Product(name='African Print Fan 3', description='Enhance your living area with this stylish African print fan, featuring a contemporary design that celebrates traditional art.', price=2500, stock=12, image_url=image_urls[2], is_featured=True, featured_priority=3, categories=[categories[0]]),
        Product(name='African Print Fan 4', description='Bring an exotic flair to your surroundings with this fashionable African print fan, offering a modern twist on classic designs.', price=2500, stock=12, image_url=image_urls[3], is_featured=True, featured_priority=4, categories=[categories[0]]),
        Product(name='African Print Fan 5', description='Brighten up your room with this trendy African print fan, combining traditional prints with a sleek, stylish look.', price=2500, stock=12, image_url=image_urls[4], is_featured=True, featured_priority=5, categories=[categories[0]]),
        Product(name='African Print Fan 6', description='Infuse your home with the essence of Africa through this eye-catching fan, designed with a stylish pattern that blends elegance with tradition.', price=2500, stock=12, image_url=image_urls[5], is_featured=True, featured_priority=6, categories=[categories[0]]),
        Product(name='African Print Fan 7', description='This chic African print fan is the perfect accessory for any space, featuring a stylish design that merges contemporary and traditional elements.', price=2500, stock=12, image_url=image_urls[6], is_featured=True, featured_priority=7, categories=[categories[0]]),
        Product(name='African Print Fan 8', description='Transform your interior with this striking African print fan, boasting a unique pattern and a modern aesthetic that stands out.', price=2500, stock=12, image_url=image_urls[7], is_featured=True, featured_priority=8, categories=[categories[0]]),
        Product(name='African Print Fan 9', description='Celebrate African artistry with this stunning fan, designed to combine stylish patterns with a touch of cultural elegance.', price=2500, stock=12, image_url=image_urls[8], is_featured=True, featured_priority=9, categories=[categories[0]]),

    # Artifacts
        Product(name='African Stool', description='Handcrafted African stool made from hard wood.', price=9000, stock=5, image_url=image_urls[9], is_featured=True, featured_priority=10, categories=[categories[1]]),
        Product(name='African Woman', description='Beautiful statue of an African woman.', price=3000, stock=8, image_url=image_urls[10], is_featured=True, featured_priority=11, categories=[categories[1]]),
        Product(name='African Woman and child', description='Elegant statue of an African woman and her child.', price=3100, stock=7, image_url=image_urls[11], is_featured=True, featured_priority=11, categories=[categories[1]]),
        Product(name='African Woman carrying her child', description='Elegant statue of an African woman carrying her child.', price=3000, stock=7, image_url=image_urls[12], is_featured=True, featured_priority=12, categories=[categories[1]]),
        Product(name='Gorilla inspired wine holder', description='Handcrafted Gorilla wine holder.', price=2500, stock=7, image_url=image_urls[13], is_featured=True, featured_priority=13, categories=[categories[1]]),
        Product(name='Lantern', description='Lantern made from papyrus drawn from Kenya rivers.', price=3300, stock=7, image_url=image_urls[14], is_featured=True, featured_priority=14, categories=[categories[1]]),
        Product(name='Lion head carving', description='Lion head carved out from the softwoods of Mount Kenya.', price=12000, stock=7, image_url=image_urls[15], is_featured=True, featured_priority=15, categories=[categories[1]]),
        Product(name='Zebra head carving', description='Zebra head carbed out from the soft woods of Mount Kenya.', price=9000, stock=7, image_url=image_urls[16], is_featured=True, featured_priority=16, categories=[categories[1]]),

    # Bags and mats
        Product(name='Bag 1', description='Stylish traditional bag.', price=1000, stock=20, image_url=image_urls[17], is_featured=True, featured_priority=17, categories=[categories[2]]),
        Product(name='Bag 2', description='Stylish traditional bag.', price=3000, stock=20, image_url=image_urls[18], is_featured=True, featured_priority=18, categories=[categories[2]]),
        Product(name='Bag 3', description='Stylish traditional bag.', price=3050, stock=20, image_url=image_urls[19], is_featured=True, featured_priority=19, categories=[categories[2]]),
        Product(name='Bag 4', description='Stylish traditional bag.', price=3100, stock=20, image_url=image_urls[20], is_featured=True, featured_priority=20, categories=[categories[2]]),
        Product(name='Bag 5', description='Stylish traditional bag.', price=3200, stock=20, image_url=image_urls[21], is_featured=True, featured_priority=21, categories=[categories[2]]),
        Product(name='Bag 6', description='Stylish traditional bag.', price=3500, stock=20, image_url=image_urls[22], is_featured=True, featured_priority=22, categories=[categories[2]]),
        Product(name='Bag 7', description='Stylish traditional bag.', price=3700, stock=20, image_url=image_urls[23], is_featured=True, featured_priority=23, categories=[categories[2]]),
        Product(name='Bag 8', description='Stylish traditional bag.', price=3750, stock=20, image_url=image_urls[24], is_featured=True, featured_priority=24, categories=[categories[2]]),
        Product(name='Bag 9', description='Stylish traditional bag.', price=3800, stock=20, image_url=image_urls[25], is_featured=True, featured_priority=25, categories=[categories[2]]),
        Product(name='Bag 10', description='Stylish traditional bag.', price=13000, stock=20, image_url=image_urls[26], is_featured=True, featured_priority=26, categories=[categories[2]]),
        Product(name='Bag 11', description='Stylish traditional bag.', price=13500, stock=20, image_url=image_urls[27], is_featured=True, featured_priority=27, categories=[categories[2]]),
        Product(name='Bag 12', description='Stylish traditional bag.', price=11000, stock=20, image_url=image_urls[28], is_featured=True, featured_priority=28, categories=[categories[2]]),

    # Bracelets
        Product(name='Bracelet 17', description='Stylish bracelet.', price=1200, stock=20, image_url=image_urls[29], is_featured=True, featured_priority=29, categories=[categories[3]]),
        Product(name='Bracelet 18', description='Stylish bracelet.', price=1200, stock=20, image_url=image_urls[30], is_featured=True, featured_priority=30, categories=[categories[3]]),
        Product(name='Bracelet 20', description='Stylish bracelet.', price=1200, stock=20, image_url=image_urls[31], is_featured=True, featured_priority=31, categories=[categories[3]]),

        Product(name='Bracelet 12', description='Stylish bracelet.', price=2000, stock=20, image_url=image_urls[32], is_featured=True, featured_priority=32, categories=[categories[3]]),
        Product(name='Bracelet 21', description='Stylish bracelet.', price=2000, stock=20, image_url=image_urls[33], is_featured=True, featured_priority=33, categories=[categories[3]]),
        Product(name='Bracelet 22', description='Stylish bracelet.', price=2000, stock=20, image_url=image_urls[34], is_featured=True, featured_priority=34, categories=[categories[3]]),
        Product(name='Bracelet 23', description='Stylish bracelet.', price=2000, stock=20, image_url=image_urls[35], is_featured=True, featured_priority=35, categories=[categories[3]]),
        Product(name='Bracelet 25', description='Stylish bracelet.', price=2000, stock=20, image_url=image_urls[36], is_featured=True, featured_priority=36, categories=[categories[3]]),
        Product(name='Bracelet 26', description='Stylish bracelet.', price=2000, stock=20, image_url=image_urls[37], is_featured=True, featured_priority=37, categories=[categories[3]]),
        Product(name='Bracelet 27', description='Stylish bracelet.', price=2000, stock=20, image_url=image_urls[38], is_featured=True, featured_priority=38, categories=[categories[3]]),

        Product(name='Bracelet 10', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[39], is_featured=True, featured_priority=39, categories=[categories[3]]),
        Product(name='Bracelet 11', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[40], is_featured=True, featured_priority=40, categories=[categories[3]]),
        Product(name='Bracelet 13', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[41], is_featured=True, featured_priority=41, categories=[categories[3]]),
        Product(name='Bracelet 14', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[42], is_featured=True, featured_priority=42, categories=[categories[3]]),
        Product(name='Bracelet 15', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[43], is_featured=True, featured_priority=43, categories=[categories[3]]),
        Product(name='Bracelet 16', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[44], is_featured=True, featured_priority=44, categories=[categories[3]]),
        Product(name='Bracelet 2', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[45], is_featured=True, featured_priority=45, categories=[categories[3]]),
        Product(name='Bracelet 28', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[46], is_featured=True, featured_priority=46, categories=[categories[3]]),
        Product(name='Bracelet 3', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[47], is_featured=True, featured_priority=47, categories=[categories[3]]),
        Product(name='Bracelet 4', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[48], is_featured=True, featured_priority=48, categories=[categories[3]]),
        Product(name='Bracelet 5', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[49], is_featured=True, featured_priority=49, categories=[categories[3]]),
        Product(name='Bracelet 7', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[50], is_featured=True, featured_priority=50, categories=[categories[3]]),
        Product(name='Bracelet 8', description='Stylish bracelet.', price=2500, stock=20, image_url=image_urls[51], is_featured=True, featured_priority=51, categories=[categories[3]]),

    # Brass chockers
        Product(name='Brass chockers 25', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[52], is_featured=True, featured_priority=52, categories=[categories[4]]),
        Product(name='Brass chockers 26', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[53], is_featured=True, featured_priority=53, categories=[categories[4]]),
        Product(name='Brass chockers 28', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[54], is_featured=True, featured_priority=54, categories=[categories[4]]),
        Product(name='Brass chockers 29', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[55], is_featured=True, featured_priority=55, categories=[categories[4]]),
        Product(name='Brass chockers 30', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[56], is_featured=True, featured_priority=56, categories=[categories[4]]),
        Product(name='Brass chockers 31', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[57], is_featured=True, featured_priority=57, categories=[categories[4]]),
        Product(name='Brass chockers 32', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[58], is_featured=True, featured_priority=58, categories=[categories[4]]),
        Product(name='Brass chockers 33', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[59], is_featured=True, featured_priority=59, categories=[categories[4]]),
        Product(name='Brass chockers 35', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[60], is_featured=True, featured_priority=60, categories=[categories[4]]),
        Product(name='Brass chockers 36', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[61], is_featured=True, featured_priority=61, categories=[categories[4]]),
        Product(name='Brass chockers 37', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[62], is_featured=True, featured_priority=62, categories=[categories[4]]),
        Product(name='Brass chockers 38', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[63], is_featured=True, featured_priority=63, categories=[categories[4]]),
        Product(name='Brass chockers 39', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[64], is_featured=True, featured_priority=64, categories=[categories[4]]),
        Product(name='Brass chockers 40', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[65], is_featured=True, featured_priority=65, categories=[categories[4]]),
        Product(name='Brass chockers 41', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[66], is_featured=True, featured_priority=66, categories=[categories[4]]),
        Product(name='Brass chockers 42', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[67], is_featured=True, featured_priority=67, categories=[categories[4]]),
        Product(name='Brass chockers 43', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[68], is_featured=True, featured_priority=68, categories=[categories[4]]),
        Product(name='Brass chockers 44', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[69], is_featured=True, featured_priority=69, categories=[categories[4]]),
        Product(name='Brass chockers 45', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[70], is_featured=True, featured_priority=70, categories=[categories[4]]),
        Product(name='Brass chockers 46', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[71], is_featured=True, featured_priority=71, categories=[categories[4]]),
        Product(name='Brass chockers 47', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[72], is_featured=True, featured_priority=72, categories=[categories[4]]),
        Product(name='Brass chockers 48', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[73], is_featured=True, featured_priority=73, categories=[categories[4]]),
        Product(name='Brass chockers 49', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[74], is_featured=True, featured_priority=74, categories=[categories[4]]),
        Product(name='Brass chockers 51', description='Stylish Brass chockers.', price=3000, stock=20, image_url=image_urls[75], is_featured=True, featured_priority=75, categories=[categories[4]]),

        Product(name='Brass chockers 10', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[76], is_featured=True, featured_priority=76, categories=[categories[4]]),
        Product(name='Brass chockers 11', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[77], is_featured=True, featured_priority=77, categories=[categories[4]]),
        Product(name='Brass chockers 12', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[78], is_featured=True, featured_priority=78, categories=[categories[4]]),
        Product(name='Brass chockers 18', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[79], is_featured=True, featured_priority=79, categories=[categories[4]]),
        Product(name='Brass chockers 22', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[80], is_featured=True, featured_priority=80, categories=[categories[4]]),
        Product(name='Brass chockers 23', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[81], is_featured=True, featured_priority=81, categories=[categories[4]]),
        Product(name='Brass chockers 24', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[82], is_featured=True, featured_priority=82, categories=[categories[4]]),
        Product(name='Brass chockers 27', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[83], is_featured=True, featured_priority=83, categories=[categories[4]]),
        Product(name='Brass chockers 34', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[84], is_featured=True, featured_priority=84, categories=[categories[4]]),
        Product(name='Brass chockers 50', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[85], is_featured=True, featured_priority=85, categories=[categories[4]]),
        Product(name='Brass chockers 7', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[86], is_featured=True, featured_priority=86, categories=[categories[4]]),
        Product(name='Brass chockers 8', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[87], is_featured=True, featured_priority=87, categories=[categories[4]]),
        Product(name='Brass chockers 9', description='Stylish Brass chockers.', price=3500, stock=20, image_url=image_urls[88], is_featured=True, featured_priority=88, categories=[categories[4]]),

        Product(name='Brass chockers 1', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[89], is_featured=True, featured_priority=89, categories=[categories[4]]),
        Product(name='Brass chockers 13', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[90], is_featured=True, featured_priority=90, categories=[categories[4]]),
        Product(name='Brass chockers 14', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[91], is_featured=True, featured_priority=91, categories=[categories[4]]),
        Product(name='Brass chockers 15', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[92], is_featured=True, featured_priority=92, categories=[categories[4]]),
        Product(name='Brass chockers 16', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[93], is_featured=True, featured_priority=93, categories=[categories[4]]),
        Product(name='Brass chockers 17', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[94], is_featured=True, featured_priority=94, categories=[categories[4]]),
        Product(name='Brass chockers 19', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[95], is_featured=True, featured_priority=95, categories=[categories[4]]),
        Product(name='Brass chockers 2', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[96], is_featured=True, featured_priority=96, categories=[categories[4]]),
        Product(name='Brass chockers 20', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[97], is_featured=True, featured_priority=97, categories=[categories[4]]),
        Product(name='Brass chockers 21', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[98], is_featured=True, featured_priority=98, categories=[categories[4]]),
        Product(name='Brass chockers 3', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[99], is_featured=True, featured_priority=99, categories=[categories[4]]),
        Product(name='Brass chockers 4', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[100], is_featured=True, featured_priority=100, categories=[categories[4]]),
        Product(name='Brass chockers 5', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[101], is_featured=True, featured_priority=101, categories=[categories[4]]),
        Product(name='Brass chockers 52', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[102], is_featured=True, featured_priority=102, categories=[categories[4]]),
        Product(name='Brass chockers 6', description='Stylish Brass chockers.', price=3800, stock=20, image_url=image_urls[103], is_featured=True, featured_priority=103, categories=[categories[4]]),

    # Brass necklaces
        Product(name='Brass necklace 1', description='Stylish Brass necklaces.', price=2500, stock=20, image_url=image_urls[104], is_featured=True, featured_priority=104, categories=[categories[5]]),
        Product(name='Brass necklace 2', description='Stylish Brass necklaces.', price=2500, stock=20, image_url=image_urls[105], is_featured=True, featured_priority=105, categories=[categories[5]]),
        Product(name='Brass necklace 3', description='Stylish Brass necklaces.', price=2500, stock=20, image_url=image_urls[106], is_featured=True, featured_priority=106, categories=[categories[5]]),
        Product(name='Brass necklace 4', description='Stylish Brass necklaces.', price=2500, stock=20, image_url=image_urls[107], is_featured=True, featured_priority=107, categories=[categories[5]]),

    # Calabashes
        Product(name='Calabash 1', description='Discover the best Calabash that you can find.', price=3000, stock=20, image_url=image_urls[108], is_featured=True, featured_priority=108, categories=[categories[6]]),
        Product(name='Calabash 6', description='High-quality Calabash for various uses.', price=3000, stock=20, image_url=image_urls[109], is_featured=True, featured_priority=109, categories=[categories[6]]),
        Product(name='Calabash 7', description='Beautifully crafted Calabash.', price=3000, stock=20, image_url=image_urls[110], is_featured=True, featured_priority=110, categories=[categories[6]]),
        Product(name='Calabash 8', description='Elegant and durable Calabash.', price=3000, stock=20, image_url=image_urls[111], is_featured=True, featured_priority=111, categories=[categories[6]]),
        Product(name='Calabash 9', description='Traditional Calabash with modern design.', price=3000, stock=20, image_url=image_urls[112], is_featured=True, featured_priority=112, categories=[categories[6]]),

        Product(name='Calabash 4', description='Beautifully crafted Calabash.', price=5000, stock=20, image_url=image_urls[113], is_featured=True, featured_priority=113, categories=[categories[6]]),
        Product(name='Calabash 5', description='Traditional Calabash with modern design.', price=5000, stock=20, image_url=image_urls[114], is_featured=True, featured_priority=114, categories=[categories[6]]),

        Product(name='Calabash 10', description='Beautifully crafted Calabash.', price=6500, stock=20, image_url=image_urls[115], is_featured=True, featured_priority=115, categories=[categories[6]]),
        Product(name='Calabash 2', description='Elegant and durable Calabash.', price=6500, stock=20, image_url=image_urls[116], is_featured=True, featured_priority=116, categories=[categories[6]]),
        Product(name='Calabash 3', description='Traditional Calabash with modern design.', price=6500, stock=20, image_url=image_urls[117], is_featured=True, featured_priority=117, categories=[categories[6]]),

    # Shields
        Product(name='Shield ke 1', description='Traditional African shield with intricate designs.', price=10000, stock=20, image_url=image_urls[118], is_featured=True, featured_priority=118, categories=[categories[7]]),
        Product(name='Shield ke 2', description='Handcrafted shield with cultural significance.', price=10000, stock=20, image_url=image_urls[119], is_featured=True, featured_priority=119, categories=[categories[7]]),

    # Wood carvings and sculptures
        Product(name='Wood Carving 1', description='Exquisite wood carving depicting wildlife.', price=12000, stock=15, image_url=image_urls[120], is_featured=True, featured_priority=120, categories=[categories[8]]),
        Product(name='Wood Carving 2', description='Handcrafted sculpture showcasing African heritage.', price=15000, stock=15, image_url=image_urls[121], is_featured=True, featured_priority=121, categories=[categories[8]]),
        Product(name='Wood Carving 3', description='Intricate wood carving of an African mask.', price=20000, stock=15, image_url=image_urls[122], is_featured=True, featured_priority=122, categories=[categories[8]]),
        Product(name='Wood Carving 4', description='Beautifully detailed wood sculpture of a dancer.', price=21000, stock=15, image_url=image_urls[123], is_featured=True, featured_priority=123, categories=[categories[8]]),
        Product(name='Wood Carving 5', description='Traditional wood carving representing African culture.', price=21500, stock=15, image_url=image_urls[124], is_featured=True, featured_priority=124, categories=[categories[8]]),
        Product(name='Wood Carving 6', description='Artistic wood sculpture with cultural motifs.', price=22400, stock=15, image_url=image_urls[125], is_featured=True, featured_priority=125, categories=[categories[8]]),
        Product(name='Wood Carving 7', description='Elegant wood carving of an African animal.', price=22450, stock=15, image_url=image_urls[126], is_featured=True, featured_priority=126, categories=[categories[8]]),
        Product(name='Wood Carving 8', description='Handcrafted wood sculpture of a tribal leader.', price=22500, stock=15, image_url=image_urls[127], is_featured=True, featured_priority=127, categories=[categories[8]]),
        Product(name='Wood Carving 9', description='Intricate wood carving with geometric patterns.', price=23000, stock=15, image_url=image_urls[128], is_featured=True, featured_priority=128, categories=[categories[8]]),
        Product(name='Wood Carving 10', description='Beautifully crafted wood sculpture of a warrior.', price=26000, stock=15, image_url=image_urls[129], is_featured=True, featured_priority=129, categories=[categories[8]]),
        Product(name='Wood Carving 11', description='Exquisite wood carving depicting African folklore.', price=27000, stock=15, image_url=image_urls[130], is_featured=True, featured_priority=130, categories=[categories[8]]),
        Product(name='Wood Carving 12', description='Artistic sculpture showcasing African wildlife.', price=28000, stock=15, image_url=image_urls[131], is_featured=True, featured_priority=131, categories=[categories[8]]),
        Product(name='Wood Carving 13', description='Traditional wood carving with a modern touch.', price=45000, stock=15, image_url=image_urls[132], is_featured=True, featured_priority=132, categories=[categories[8]]),
        Product(name='Wood Carving 14', description='Handcrafted wood sculpture of an African scene.', price=49000, stock=15, image_url=image_urls[133], is_featured=True, featured_priority=133, categories=[categories[8]]),
        Product(name='Wood Carving 15', description='Elegant wood carving with intricate details.', price=55000, stock=15, image_url=image_urls[134], is_featured=True, featured_priority=134, categories=[categories[8]]),
        Product(name='Wood Carving 16', description='Artistic wood sculpture of a traditional figure.', price=7000, stock=15, image_url=image_urls[135], is_featured=True, featured_priority=135, categories=[categories[8]]),
        Product(name='Wood Carving 17', description='Beautifully detailed wood carving of a mythological creature.', price=7100, stock=15, image_url=image_urls[136], is_featured=True, featured_priority=136, categories=[categories[8]]),
        Product(name='Wood Carving 18', description='Exquisite sculpture showcasing African craftsmanship.', price=7200, stock=15, image_url=image_urls[137], is_featured=True, featured_priority=137, categories=[categories[8]]),
        Product(name='Wood Carving 19', description='Handcrafted wood carving of a historical figure.', price=8000, stock=15, image_url=image_urls[138], is_featured=True, featured_priority=138, categories=[categories[8]]),

    ]

    # Add to session
    db.session.add_all(products)
    db.session.commit()

    # Create cart items for users
    cart_items = [
        CartItem(user_id=users[0].id, product_id=products[0].id, quantity=2),
        CartItem(user_id=users[1].id, product_id=products[1].id, quantity=1),
        CartItem(user_id=users[2].id, product_id=products[2].id, quantity=1),
        CartItem(user_id=users[3].id, product_id=products[3].id, quantity=3),
        CartItem(user_id=users[2].id, product_id=products[3].id, quantity=3),
    ]
    db.session.add_all(cart_items)
    db.session.commit()

    # Create orders for users
    orders = [
        Order(user_id=users[0].id, total_price=399.98, status='Pending'),
        Order(user_id=users[1].id, total_price=49.99, status='Pending'),
        Order(user_id=users[2].id, total_price=299.99, status='Pending'),
        Order(user_id=users[3].id, total_price=269.97, status='Delivered'),
        Order(user_id=users[1].id, total_price=269.97, status='Cancelled'),
        Order(user_id=users[1].id, total_price=29.97, status='Delivered'),
        Order(user_id=users[1].id, total_price=109.87, status='Processing'),
    ]
    db.session.add_all(orders)
    db.session.commit()

    # Create order items
    order_items = [
        OrderItem(order_id=orders[0].id, product_id=products[0].id, quantity=2),
        OrderItem(order_id=orders[1].id, product_id=products[1].id, quantity=1),
        OrderItem(order_id=orders[2].id, product_id=products[2].id, quantity=1),
        OrderItem(order_id=orders[3].id, product_id=products[3].id, quantity=3),
        OrderItem(order_id=orders[4].id, product_id=products[5].id, quantity=1),
        OrderItem(order_id=orders[1].id, product_id=products[8].id, quantity=1),
        OrderItem(order_id=orders[1].id, product_id=products[10].id, quantity=1),
    ]
    db.session.add_all(order_items)
    db.session.commit()

    # Create notifications for users
    notifications = [
        Notification(user_id=users[0].id, title='Order Confirmation', message='Your order has been confirmed.', type='order', created_at=datetime.utcnow()),
        Notification(user_id=users[1].id, title='Shipping Update', message='Your order has been shipped.', type='shipping', created_at=datetime.utcnow()),
        Notification(user_id=users[2].id, title='Delivery Update', message='Your order is out for delivery.', type='delivery', created_at=datetime.utcnow()),
        Notification(user_id=users[3].id, title='Order Delivered', message='Your order has been delivered.', type='delivery', created_at=datetime.utcnow()),
    ]
    db.session.add_all(notifications)
    db.session.commit()

    # Create support tickets for users
    support_tickets = [
        SupportTicket(user_id=users[0].id, subject='Issue with order', message='I received a damaged product.', status='Open'),
        SupportTicket(user_id=users[1].id, subject='Payment issue', message='I was charged twice.', status='Open'),
        SupportTicket(user_id=users[2].id, subject='Shipping delay', message='My order is delayed.', status='Closed'),
        SupportTicket(user_id=users[3].id, subject='Product inquiry', message='Is this product available in other colors?', status='Open'),
    ]
    db.session.add_all(support_tickets)
    db.session.commit()

    # Create wishlist items for users
    wishlist_items = [
        WishlistItem(user_id=users[0].id, product_id=products[1].id),
        WishlistItem(user_id=users[1].id, product_id=products[2].id),
        WishlistItem(user_id=users[2].id, product_id=products[3].id),
        WishlistItem(user_id=users[3].id, product_id=products[4].id),
    ]
    db.session.add_all(wishlist_items)
    db.session.commit()

    # Create payment methods
    payment_methods = [
        PaymentMethod(name='Credit Card', description='Pay with credit card'),
        PaymentMethod(name='PayPal', description='Pay with PayPal'),
        PaymentMethod(name='Bank Transfer', description='Pay via bank transfer'),
        PaymentMethod(name='Cash on Delivery', description='Pay with cash upon delivery')
    ]
    db.session.add_all(payment_methods)
    db.session.commit()

    # Create shipping methods
    shipping_methods = [
        ShippingMethod(name='Standard Shipping', description='Delivers in 5-7 business days'),
        ShippingMethod(name='Express Shipping', description='Delivers in 2-3 business days'),
        ShippingMethod(name='Overnight Shipping', description='Delivers next day'),
        ShippingMethod(name='International Shipping', description='Delivers in 7-14 business days')
    ]
    db.session.add_all(shipping_methods)
    db.session.commit()

    # Create FAQs
    faqs = [
        FAQ(question='How can I track my order?', answer='You can track your order using the tracking number provided in the shipment confirmation email.'),
        FAQ(question='What is the return policy?', answer='You can return products within 30 days of delivery for a full refund.'),
        FAQ(question='How do I change my shipping address?', answer='You can change your shipping address from your account settings before the order is shipped.'),
        FAQ(question='How do I contact customer service?', answer='You can contact our customer service through the support page on our website.')
    ]
    db.session.add_all(faqs)
    db.session.commit()

    # Create contact queries
    contact_queries = [
        ContactQuery(name='Alice Smith', email='alice@example.com', message='I have a question about my order.'),
        ContactQuery(name='Bob Johnson', email='bob@example.com', message='I need help with a product.'),
        ContactQuery(name='Charlie Lee', email='charlie@example.com', message='I want to change my shipping address.'),
        ContactQuery(name='Diana Green', email='diana@example.com', message='I have a question about payment.')
    ]
    db.session.add_all(contact_queries)
    db.session.commit()

    # Create banners
    banners = [
        Banner(title='Summer Sale', image_url='banner_image_url_1'),
        Banner(title='New Arrivals', image_url='banner_image_url_2'),
        Banner(title='Holiday Discounts', image_url='banner_image_url_3'),
        Banner(title='Clearance Sale', image_url='banner_image_url_4')
    ]
    db.session.add_all(banners)
    db.session.commit()

    # Create featured products
    featured_products = [
        FeaturedProduct(product_id=products[0].id, priority=1),
        FeaturedProduct(product_id=products[1].id, priority=2),
        FeaturedProduct(product_id=products[2].id, priority=3),
        FeaturedProduct(product_id=products[3].id, priority=4)
    ]
    db.session.add_all(featured_products)
    db.session.commit()

    print("Database populated successfully!")

if __name__ == '__main__':
    with app.app_context():
        populate_database()
