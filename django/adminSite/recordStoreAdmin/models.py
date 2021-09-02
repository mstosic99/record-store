from django.db import models


class Addresses(models.Model):
    address_id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=45)
    zipcode = models.CharField(max_length=45)
    user = models.ForeignKey("Users", models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "Addresses"


class Genres(models.Model):
    genre_id = models.AutoField(primary_key=True)
    genre = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "Genres"


class Artists(models.Model):
    artist_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "Artists"


class Records(models.Model):
    record_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=45)
    price = models.IntegerField()
    stock = models.IntegerField()
    year = models.IntegerField()
    image = models.CharField(max_length=50000)
    genre = models.ForeignKey(Genres, models.DO_NOTHING)
    artist = models.ForeignKey(Artists, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "Records"


class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    datetime = models.DateTimeField()
    status = models.TextField()
    price = models.IntegerField()
    address = models.ForeignKey(Addresses, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "Orders"

    def __str__(self):
        return str(self.price) + "$ - " + self.address.address


class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    lastname = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    password = models.CharField(max_length=150)
    phone = models.CharField(max_length=45)
    admin = models.IntegerField()

    class Meta:
        managed = False
        db_table = "Users"


class Carts(models.Model):
    order_record_id = models.AutoField(primary_key=True)
    order = models.ForeignKey("Orders", models.DO_NOTHING)
    record = models.ForeignKey("Records", models.DO_NOTHING)
    quantity = models.IntegerField()

    class Meta:
        managed = False
        db_table = "Carts"
