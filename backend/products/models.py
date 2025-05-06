from django.db import models
from users.models import User

from django.db import models

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=50,
        choices=[
            ('women', 'Women'),
            ('men', 'Men'),
        ],
        default='women'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'type'], name='unique_name_per_type')
        ]

    def __str__(self):
        return f"{self.name} ({self.type})"

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    # image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    average_rating = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sizes = models.CharField(max_length=100, blank=True)  
    colors = models.CharField(max_length=100, blank=True)  
    material = models.CharField(max_length=100, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['material']),
            models.Index(fields=['colors']),
        ]

    def __str__(self):
        return self.name
    
    def update_avg_rating(self):
        reviews = self.reviews.filter(rating__isnull=False).exclude(rating=0)
        if reviews.exists():
            total_score = sum(review.rating for review in reviews)
            avg_rating = total_score / reviews.count()
        else:
            avg_rating = 0
        self.average_rating = avg_rating
        self.save()


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')
    def __str__(self):
        return f"Image for {self.product.name}"
    


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings')
    score = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('user', 'product')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.update_avg_rating()


