PGDMP              	    
    {            mmapp    16.0    16.0 �               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16397    mmapp    DATABASE     x   CREATE DATABASE mmapp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE mmapp;
                postgres    false                        3079    16398 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false                        0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    2            �            1259    16637 	   admintags    TABLE     �   CREATE TABLE public.admintags (
    tag_id integer NOT NULL,
    tag_name character varying,
    category_id integer,
    subcategory_id integer,
    tag_values character varying[]
);
    DROP TABLE public.admintags;
       public         heap    postgres    false            �            1259    16654    admintags_tag_id_seq    SEQUENCE     }   CREATE SEQUENCE public.admintags_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.admintags_tag_id_seq;
       public          postgres    false    252            !           0    0    admintags_tag_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.admintags_tag_id_seq OWNED BY public.admintags.tag_id;
          public          postgres    false    253            �            1259    16408 
   attributes    TABLE     �   CREATE TABLE public.attributes (
    attribute_id integer NOT NULL,
    vendor_id integer,
    attribute_name character varying(255) NOT NULL,
    attribute_values text[]
);
    DROP TABLE public.attributes;
       public         heap    postgres    false            �            1259    16413    attributes_attribute_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attributes_attribute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.attributes_attribute_id_seq;
       public          postgres    false    216            "           0    0    attributes_attribute_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.attributes_attribute_id_seq OWNED BY public.attributes.attribute_id;
          public          postgres    false    217            �            1259    16414    audioheadphones    TABLE       CREATE TABLE public.audioheadphones (
    product_ah_id integer NOT NULL,
    ad_title text NOT NULL,
    description text NOT NULL,
    images text[] NOT NULL,
    price numeric NOT NULL,
    currency_symbol text NOT NULL,
    city text,
    state text,
    country text,
    brand text,
    category text,
    vendorid integer,
    is_featured boolean DEFAULT false NOT NULL,
    is_sold boolean DEFAULT false NOT NULL,
    is_negotiable boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rejection_reason text,
    status integer DEFAULT 0,
    updated_at_product timestamp without time zone,
    uniquepid character varying(50),
    category_type character varying(255),
    subcategory text,
    condition text
);
 #   DROP TABLE public.audioheadphones;
       public         heap    postgres    false            �            1259    16424 "   audio_headphones_product_ah_id_seq    SEQUENCE     �   CREATE SEQUENCE public.audio_headphones_product_ah_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.audio_headphones_product_ah_id_seq;
       public          postgres    false    218            #           0    0 "   audio_headphones_product_ah_id_seq    SEQUENCE OWNED BY     h   ALTER SEQUENCE public.audio_headphones_product_ah_id_seq OWNED BY public.audioheadphones.product_ah_id;
          public          postgres    false    219            �            1259    16425    cameraphotography    TABLE     #  CREATE TABLE public.cameraphotography (
    product_cp_id integer NOT NULL,
    ad_title text NOT NULL,
    description text NOT NULL,
    images text[] NOT NULL,
    price numeric NOT NULL,
    currency_symbol text NOT NULL,
    city text,
    state text,
    country text,
    brand text,
    category text,
    vendorid integer,
    is_featured boolean DEFAULT false NOT NULL,
    is_sold boolean DEFAULT false NOT NULL,
    is_negotiable boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    subcategory character varying(255),
    rejection_reason text,
    status integer DEFAULT 0,
    updated_at_product timestamp without time zone,
    uniquepid character varying(50),
    category_type character varying(255),
    condition text
);
 %   DROP TABLE public.cameraphotography;
       public         heap    postgres    false            �            1259    16435 $   camera_photography_product_cp_id_seq    SEQUENCE     �   CREATE SEQUENCE public.camera_photography_product_cp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.camera_photography_product_cp_id_seq;
       public          postgres    false    220            $           0    0 $   camera_photography_product_cp_id_seq    SEQUENCE OWNED BY     l   ALTER SEQUENCE public.camera_photography_product_cp_id_seq OWNED BY public.cameraphotography.product_cp_id;
          public          postgres    false    221                       1259    16735    cart_cart_id_seq    SEQUENCE     y   CREATE SEQUENCE public.cart_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.cart_cart_id_seq;
       public          postgres    false                       1259    16719    cart    TABLE     �  CREATE TABLE public.cart (
    cart_id integer DEFAULT nextval('public.cart_cart_id_seq'::regclass) NOT NULL,
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    product_color character varying,
    product_size character varying,
    add_ons jsonb
);
    DROP TABLE public.cart;
       public         heap    postgres    false    263            �            1259    16436 
   categories    TABLE     �  CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    category_description text,
    category_image_url character varying(255),
    category_status boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    category_type character varying(255),
    category_meta_title character varying
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    16444    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false    222            %           0    0    categories_category_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;
          public          postgres    false    223                       1259    16698    contactus_contact_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contactus_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.contactus_contact_id_seq;
       public          postgres    false                       1259    16691 	   contactus    TABLE     /  CREATE TABLE public.contactus (
    contact_id integer DEFAULT nextval('public.contactus_contact_id_seq'::regclass) NOT NULL,
    name character varying,
    email character varying,
    subject character varying,
    message character varying,
    "timestamp" timestamp with time zone DEFAULT now()
);
    DROP TABLE public.contactus;
       public         heap    postgres    false    259                       1259    16904    currency_rates_rate_id_seq    SEQUENCE     �   CREATE SEQUENCE public.currency_rates_rate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.currency_rates_rate_id_seq;
       public          postgres    false                       1259    16896    currency_rates    TABLE     K  CREATE TABLE public.currency_rates (
    rate_id integer DEFAULT nextval('public.currency_rates_rate_id_seq'::regclass) NOT NULL,
    from_currency character varying,
    to_currency character varying,
    exchange_rate numeric,
    markup_percentage numeric DEFAULT 0,
    effective_date timestamp with time zone DEFAULT now()
);
 "   DROP TABLE public.currency_rates;
       public         heap    postgres    false    274            �            1259    16445    customer_follows    TABLE     �   CREATE TABLE public.customer_follows (
    follow_id integer NOT NULL,
    follower_id integer NOT NULL,
    following_id integer NOT NULL,
    follow_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 $   DROP TABLE public.customer_follows;
       public         heap    postgres    false            �            1259    16449    customer_follows_follow_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_follows_follow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.customer_follows_follow_id_seq;
       public          postgres    false    224            &           0    0    customer_follows_follow_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.customer_follows_follow_id_seq OWNED BY public.customer_follows.follow_id;
          public          postgres    false    225                       1259    16717 !   customer_wishlist_wishlist_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_wishlist_wishlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.customer_wishlist_wishlist_id_seq;
       public          postgres    false                       1259    16701    customer_wishlist    TABLE       CREATE TABLE public.customer_wishlist (
    wishlist_id integer DEFAULT nextval('public.customer_wishlist_wishlist_id_seq'::regclass) NOT NULL,
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    added_date timestamp with time zone DEFAULT now() NOT NULL
);
 %   DROP TABLE public.customer_wishlist;
       public         heap    postgres    false    261            �            1259    16450 	   customers    TABLE     �  CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    given_name character varying(50) NOT NULL,
    family_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    phone_number character varying(20),
    address_line_1 character varying(100),
    address_line_2 character varying(100),
    city character varying(50),
    state character varying(50),
    zip_code character varying(20),
    country character varying(50),
    bio text,
    verified_with text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status integer DEFAULT 0 NOT NULL,
    picture character varying(255),
    google_id character varying(255),
    facebook_id character varying(255),
    verification_code integer,
    verification_expire_date timestamp without time zone,
    customer_loggedid text
);
    DROP TABLE public.customers;
       public         heap    postgres    false            �            1259    16458    customers_customer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.customers_customer_id_seq;
       public          postgres    false    226            '           0    0    customers_customer_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;
          public          postgres    false    227            �            1259    16459    laptopcomputers    TABLE       CREATE TABLE public.laptopcomputers (
    product_lc_id integer NOT NULL,
    ad_title text NOT NULL,
    images text[] NOT NULL,
    currency_symbol text NOT NULL,
    city text,
    state text,
    country text,
    brand text,
    category text,
    vendorid integer,
    is_featured boolean DEFAULT false NOT NULL,
    is_sold boolean DEFAULT false NOT NULL,
    is_negotiable boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    subcategory character varying(255),
    rejection_reason text,
    status integer DEFAULT 0,
    updated_at_product timestamp without time zone,
    uniquepid character varying(50),
    category_type character varying(255),
    condition text,
    skuid text,
    mrp text,
    sellingprice text,
    localdeliverycharge text,
    zonaldeliverycharge text,
    nationaldeliverycharge text,
    weightkg text,
    lengthcm text,
    breadthcm text,
    heightcm text,
    countryoforigin text,
    manufacturername text,
    packerdetails text,
    additionaldescription text,
    searchkeywords text,
    salespackage text,
    keyfeatures text,
    videourl text,
    modelname text,
    processor text,
    ram text,
    storagetype text,
    storagecapacity text,
    displaysize text,
    screenresolution text,
    graphicscard text,
    operatingsystem text,
    connectivityports text,
    batterylife text,
    keyboardtype text,
    touchpad text,
    dimensions text,
    weight text,
    warrantyinformation text,
    isvariant text,
    quantity integer
);
 #   DROP TABLE public.laptopcomputers;
       public         heap    postgres    false            �            1259    16469 !   laptopcomputers_product_lc_id_seq    SEQUENCE     �   CREATE SEQUENCE public.laptopcomputers_product_lc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.laptopcomputers_product_lc_id_seq;
       public          postgres    false    228            (           0    0 !   laptopcomputers_product_lc_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.laptopcomputers_product_lc_id_seq OWNED BY public.laptopcomputers.product_lc_id;
          public          postgres    false    229            �            1259    16470    mobileelectronics    TABLE     5  CREATE TABLE public.mobileelectronics (
    product_me_id integer NOT NULL,
    ad_title character varying(255) NOT NULL,
    description text,
    images text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    price numeric,
    location character varying(255),
    city character varying(100),
    state character varying(100),
    country character varying(100),
    currency_symbol character varying(10),
    category character varying(100),
    subcategory character varying(100),
    condition character varying(50),
    brand character varying(100),
    year integer,
    is_featured boolean DEFAULT false,
    views integer DEFAULT 0,
    is_sold boolean DEFAULT false,
    is_negotiable boolean DEFAULT true,
    vendorid integer,
    rejection_reason text,
    status integer DEFAULT 0,
    updated_at_product timestamp without time zone,
    uniquepid character varying(50),
    category_type character varying(255),
    modelname text,
    processor text,
    ram text,
    storagetype text,
    storagecapacity text,
    displaysize text,
    screenresolution text,
    graphicscard text,
    operatingsystem text,
    connectivityports text,
    batterylife text,
    touchpad text,
    dimensions text,
    weight text,
    warrantyinformation text
);
 %   DROP TABLE public.mobileelectronics;
       public         heap    postgres    false            
           1259    16791    orderitems_order_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orderitems_order_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.orderitems_order_item_id_seq;
       public          postgres    false            	           1259    16769 
   orderitems    TABLE     �  CREATE TABLE public.orderitems (
    order_item_id integer DEFAULT nextval('public.orderitems_order_item_id_seq'::regclass) NOT NULL,
    order_id bigint,
    product_id integer,
    quantity integer,
    price numeric,
    product_color character varying,
    product_size character varying,
    add_ons jsonb,
    currency character varying,
    order_item_status character varying,
    cancellation_reason character varying,
    statusupdate_date timestamp with time zone DEFAULT now()
);
    DROP TABLE public.orderitems;
       public         heap    postgres    false    266                       1259    16744    orders    TABLE       CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    customer_id integer,
    order_date timestamp with time zone,
    total_amount numeric,
    currency character varying,
    order_status character varying,
    order_updated_date timestamp with time zone DEFAULT now()
);
    DROP TABLE public.orders;
       public         heap    postgres    false                       1259    16819     orderstatushistory_status_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orderstatushistory_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.orderstatushistory_status_id_seq;
       public          postgres    false                       1259    16807    orderstatushistory    TABLE     �   CREATE TABLE public.orderstatushistory (
    status_id integer DEFAULT nextval('public.orderstatushistory_status_id_seq'::regclass) NOT NULL,
    order_id bigint,
    order_status character varying,
    status_date timestamp with time zone
);
 &   DROP TABLE public.orderstatushistory;
       public         heap    postgres    false    270            �            1259    16482    payments    TABLE     B  CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    customer_id integer NOT NULL,
    order_id integer NOT NULL,
    payment_date timestamp without time zone NOT NULL,
    payment_method character varying(255) NOT NULL,
    payment_amount numeric(10,2) NOT NULL,
    payment_status character varying(50) NOT NULL,
    billing_address text,
    billing_city character varying(100),
    billing_state character varying(100),
    billing_zip character varying(20),
    currency_code character(3),
    payment_source character varying(255),
    vendor_id integer
);
    DROP TABLE public.payments;
       public         heap    postgres    false            �            1259    16487    payments_payment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.payments_payment_id_seq;
       public          postgres    false    231            )           0    0    payments_payment_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;
          public          postgres    false    232                       1259    16805 "   paymenttransactions_payment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.paymenttransactions_payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.paymenttransactions_payment_id_seq;
       public          postgres    false                       1259    16793    paymenttransactions    TABLE     T  CREATE TABLE public.paymenttransactions (
    payment_id integer DEFAULT nextval('public.paymenttransactions_payment_id_seq'::regclass) NOT NULL,
    transaction_id character varying,
    order_id bigint,
    payment_date timestamp with time zone,
    amount numeric,
    currency character varying,
    payment_method character varying
);
 '   DROP TABLE public.paymenttransactions;
       public         heap    postgres    false    268            �            1259    16488 ,   product_mobile_electronics_product_me_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_mobile_electronics_product_me_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.product_mobile_electronics_product_me_id_seq;
       public          postgres    false    230            *           0    0 ,   product_mobile_electronics_product_me_id_seq    SEQUENCE OWNED BY     t   ALTER SEQUENCE public.product_mobile_electronics_product_me_id_seq OWNED BY public.mobileelectronics.product_me_id;
          public          postgres    false    233                       1259    16840    productreviews_review_id_seq    SEQUENCE     �   CREATE SEQUENCE public.productreviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.productreviews_review_id_seq;
       public          postgres    false                       1259    16822    productreviews    TABLE     Y  CREATE TABLE public.productreviews (
    review_id integer DEFAULT nextval('public.productreviews_review_id_seq'::regclass) NOT NULL,
    product_id integer,
    customer_id integer,
    rating numeric,
    title character varying,
    content character varying,
    review_date timestamp with time zone DEFAULT now(),
    review_media jsonb
);
 "   DROP TABLE public.productreviews;
       public         heap    postgres    false    272            �            1259    16489    products    TABLE     �  CREATE TABLE public.products (
    product_id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    brand character varying(100),
    product_images jsonb,
    vendor_id integer NOT NULL,
    featured boolean,
    product_tags jsonb,
    product_variants jsonb,
    add_ons jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    product_type character varying,
    discount numeric,
    size_chart character varying,
    product_status integer,
    rejection_reason character varying,
    category_id integer,
    subcategory_id integer,
    product_care jsonb,
    currency_symbol character varying,
    weight numeric,
    shipping_fee jsonb,
    ratings numeric,
    review_count integer,
    weight_unit character varying
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    16499    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    234            +           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    235            �            1259    16500    social_logins    TABLE     �   CREATE TABLE public.social_logins (
    login_id integer NOT NULL,
    customer_id integer NOT NULL,
    provider character varying(50) NOT NULL,
    provider_user_id character varying(255) NOT NULL
);
 !   DROP TABLE public.social_logins;
       public         heap    postgres    false            �            1259    16503    social_logins_login_id_seq    SEQUENCE     �   CREATE SEQUENCE public.social_logins_login_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.social_logins_login_id_seq;
       public          postgres    false    236            ,           0    0    social_logins_login_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.social_logins_login_id_seq OWNED BY public.social_logins.login_id;
          public          postgres    false    237            �            1259    16504    subcategories    TABLE     �  CREATE TABLE public.subcategories (
    subcategory_id integer NOT NULL,
    subcategory_name character varying(255) NOT NULL,
    subcategory_description text,
    subcategory_image_url character varying(255),
    parent_category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    subcategory_meta_title character varying
);
 !   DROP TABLE public.subcategories;
       public         heap    postgres    false            �            1259    16511     subcategories_subcategory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.subcategories_subcategory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.subcategories_subcategory_id_seq;
       public          postgres    false    238            -           0    0     subcategories_subcategory_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.subcategories_subcategory_id_seq OWNED BY public.subcategories.subcategory_id;
          public          postgres    false    239            �            1259    16512 
   superadmin    TABLE       CREATE TABLE public.superadmin (
    id integer NOT NULL,
    email character varying(255),
    password character varying(255),
    "userId" character varying(255),
    role_id integer[],
    "position" character varying(255),
    name character varying(255)
);
    DROP TABLE public.superadmin;
       public         heap    postgres    false            �            1259    16517    superadmin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.superadmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.superadmin_id_seq;
       public          postgres    false    240            .           0    0    superadmin_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.superadmin_id_seq OWNED BY public.superadmin.id;
          public          postgres    false    241            �            1259    16664    support_ticket_ticket_id_seq    SEQUENCE     �   CREATE SEQUENCE public.support_ticket_ticket_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.support_ticket_ticket_id_seq;
       public          postgres    false            �            1259    16656    support_ticket    TABLE       CREATE TABLE public.support_ticket (
    ticket_id integer DEFAULT nextval('public.support_ticket_ticket_id_seq'::regclass) NOT NULL,
    subject character varying,
    status character varying,
    "timestamp" timestamp with time zone DEFAULT now(),
    customer_id integer
);
 "   DROP TABLE public.support_ticket;
       public         heap    postgres    false    255                       1259    16688 &   support_ticket_messages_message_id_seq    SEQUENCE     �   CREATE SEQUENCE public.support_ticket_messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.support_ticket_messages_message_id_seq;
       public          postgres    false                        1259    16671    support_ticket_messages    TABLE     :  CREATE TABLE public.support_ticket_messages (
    message_id integer DEFAULT nextval('public.support_ticket_messages_message_id_seq'::regclass) NOT NULL,
    ticket_id integer,
    customer_id integer,
    message character varying,
    "timestamp" timestamp with time zone DEFAULT now(),
    attachments jsonb
);
 +   DROP TABLE public.support_ticket_messages;
       public         heap    postgres    false    257            �            1259    16518    variantproducts    TABLE     F  CREATE TABLE public.variantproducts (
    variant_id integer NOT NULL,
    product_uniqueid character varying(255),
    variant_mrp numeric(10,2),
    variant_sellingprice numeric(10,2),
    variant_skuid character varying(255),
    variant_quantity integer,
    variantsvalues text,
    label text,
    vendori_id integer
);
 #   DROP TABLE public.variantproducts;
       public         heap    postgres    false            �            1259    16523    variantproducts_variant_id_seq    SEQUENCE     �   CREATE SEQUENCE public.variantproducts_variant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.variantproducts_variant_id_seq;
       public          postgres    false    242            /           0    0    variantproducts_variant_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.variantproducts_variant_id_seq OWNED BY public.variantproducts.variant_id;
          public          postgres    false    243            �            1259    16524    vendorproductorder    TABLE     x  CREATE TABLE public.vendorproductorder (
    order_id integer NOT NULL,
    vendor_id integer,
    product_uniqueid integer,
    customer_id integer,
    order_date timestamp without time zone,
    total_amount numeric(10,2),
    order_status character varying(50),
    rejection_reason text,
    product_name character varying(255),
    customer_name character varying(255),
    product_image text,
    customer_email character varying(255),
    customer_phone_number character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    currency_symbol character varying(10),
    payment_method character varying(50),
    payment_status character varying(50),
    city character varying(100),
    state character varying(100),
    country character varying(100),
    brand character varying(100),
    category character varying(100),
    subcategory character varying(100),
    product_type character varying(50),
    transaction_id character varying(255) DEFAULT NULL::character varying,
    commission_fee numeric,
    withdrawal_amount numeric,
    refund_amount numeric,
    fees_paid numeric,
    tax_collected numeric
);
 &   DROP TABLE public.vendorproductorder;
       public         heap    postgres    false            �            1259    16531    vendorproductorder_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendorproductorder_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.vendorproductorder_order_id_seq;
       public          postgres    false    244            0           0    0    vendorproductorder_order_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.vendorproductorder_order_id_seq OWNED BY public.vendorproductorder.order_id;
          public          postgres    false    245            �            1259    16532    vendors    TABLE     �  CREATE TABLE public.vendors (
    id integer NOT NULL,
    country_code character varying(10) NOT NULL,
    mobile_number character varying(20) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    brand_name character varying(255),
    business_model character varying(255),
    products jsonb,
    trademark_certificate jsonb,
    company_name character varying(255),
    company_city character varying(255),
    company_state character varying(255),
    company_country character varying(255),
    company_zip_code character varying(255),
    shipping_address character varying(255),
    bank_name character varying(255),
    bank_account_number character varying(50),
    bank_routing_number character varying(50),
    bank_account_name character varying(255),
    bank_branch character varying(255),
    bank_swift_code character varying(50),
    registration_date character varying(255),
    mobile_verification_status boolean,
    email_verification_status boolean,
    status integer DEFAULT 0,
    business_type character varying(255),
    registration_number character varying(50),
    tax_id_number character varying(255),
    business_address character varying(255),
    business_phone character varying(255),
    business_email character varying(255),
    business_website character varying(255),
    business_description character varying(255),
    facebook_url character varying(255),
    instagram_url character varying(255),
    twitter_url character varying(255),
    linkedin_url character varying(255),
    business_logo_url character varying(255),
    business_license_url character varying(255),
    return_policy text,
    shipping_policy text,
    terms_and_conditions text,
    payment_info text,
    shipping_info text,
    support_contact character varying(100),
    categories text,
    average_rating numeric(3,2),
    total_products integer,
    total_sales numeric(10,2),
    support_contact_1 character varying(255),
    support_contact_2 character varying(255),
    vendor_profile_picture_url jsonb,
    brand_logo jsonb,
    useridvendor character varying(255),
    vendorname text,
    email_otp character varying(4),
    mobile_otp character varying(4),
    reset_otp text
);
    DROP TABLE public.vendors;
       public         heap    postgres    false            �            1259    16538    vendors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.vendors_id_seq;
       public          postgres    false    246            1           0    0    vendors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;
          public          postgres    false    247            �            1259    16539    vendors_notifications    TABLE     �   CREATE TABLE public.vendors_notifications (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    type character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    date text NOT NULL
);
 )   DROP TABLE public.vendors_notifications;
       public         heap    postgres    false            �            1259    16544    vendors_notifications_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.vendors_notifications_id_seq;
       public          postgres    false    248            2           0    0    vendors_notifications_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.vendors_notifications_id_seq OWNED BY public.vendors_notifications.id;
          public          postgres    false    249            �            1259    16545    withdrawals    TABLE       CREATE TABLE public.withdrawals (
    withdrawal_id integer NOT NULL,
    vendor_id integer NOT NULL,
    currency_code character varying(100) NOT NULL,
    amount numeric(10,2) NOT NULL,
    withdrawal_date date NOT NULL,
    status character varying(20) NOT NULL,
    bank_account_number character varying(20) NOT NULL,
    bank_name character varying(100) NOT NULL,
    bank_branch character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.withdrawals;
       public         heap    postgres    false            �            1259    16550    withdrawals_withdrawal_id_seq    SEQUENCE     �   CREATE SEQUENCE public.withdrawals_withdrawal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.withdrawals_withdrawal_id_seq;
       public          postgres    false    250            3           0    0    withdrawals_withdrawal_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.withdrawals_withdrawal_id_seq OWNED BY public.withdrawals.withdrawal_id;
          public          postgres    false    251            �           2604    16655    admintags tag_id    DEFAULT     t   ALTER TABLE ONLY public.admintags ALTER COLUMN tag_id SET DEFAULT nextval('public.admintags_tag_id_seq'::regclass);
 ?   ALTER TABLE public.admintags ALTER COLUMN tag_id DROP DEFAULT;
       public          postgres    false    253    252            �           2604    16551    attributes attribute_id    DEFAULT     �   ALTER TABLE ONLY public.attributes ALTER COLUMN attribute_id SET DEFAULT nextval('public.attributes_attribute_id_seq'::regclass);
 F   ALTER TABLE public.attributes ALTER COLUMN attribute_id DROP DEFAULT;
       public          postgres    false    217    216            �           2604    16552    audioheadphones product_ah_id    DEFAULT     �   ALTER TABLE ONLY public.audioheadphones ALTER COLUMN product_ah_id SET DEFAULT nextval('public.audio_headphones_product_ah_id_seq'::regclass);
 L   ALTER TABLE public.audioheadphones ALTER COLUMN product_ah_id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    16553    cameraphotography product_cp_id    DEFAULT     �   ALTER TABLE ONLY public.cameraphotography ALTER COLUMN product_cp_id SET DEFAULT nextval('public.camera_photography_product_cp_id_seq'::regclass);
 N   ALTER TABLE public.cameraphotography ALTER COLUMN product_cp_id DROP DEFAULT;
       public          postgres    false    221    220            �           2604    16554    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    223    222            �           2604    16555    customer_follows follow_id    DEFAULT     �   ALTER TABLE ONLY public.customer_follows ALTER COLUMN follow_id SET DEFAULT nextval('public.customer_follows_follow_id_seq'::regclass);
 I   ALTER TABLE public.customer_follows ALTER COLUMN follow_id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    16556    customers customer_id    DEFAULT     ~   ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);
 D   ALTER TABLE public.customers ALTER COLUMN customer_id DROP DEFAULT;
       public          postgres    false    227    226            �           2604    16557    laptopcomputers product_lc_id    DEFAULT     �   ALTER TABLE ONLY public.laptopcomputers ALTER COLUMN product_lc_id SET DEFAULT nextval('public.laptopcomputers_product_lc_id_seq'::regclass);
 L   ALTER TABLE public.laptopcomputers ALTER COLUMN product_lc_id DROP DEFAULT;
       public          postgres    false    229    228            �           2604    16558    mobileelectronics product_me_id    DEFAULT     �   ALTER TABLE ONLY public.mobileelectronics ALTER COLUMN product_me_id SET DEFAULT nextval('public.product_mobile_electronics_product_me_id_seq'::regclass);
 N   ALTER TABLE public.mobileelectronics ALTER COLUMN product_me_id DROP DEFAULT;
       public          postgres    false    233    230            �           2604    16559    payments payment_id    DEFAULT     z   ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);
 B   ALTER TABLE public.payments ALTER COLUMN payment_id DROP DEFAULT;
       public          postgres    false    232    231            �           2604    16560    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    235    234            �           2604    16561    social_logins login_id    DEFAULT     �   ALTER TABLE ONLY public.social_logins ALTER COLUMN login_id SET DEFAULT nextval('public.social_logins_login_id_seq'::regclass);
 E   ALTER TABLE public.social_logins ALTER COLUMN login_id DROP DEFAULT;
       public          postgres    false    237    236            �           2604    16562    subcategories subcategory_id    DEFAULT     �   ALTER TABLE ONLY public.subcategories ALTER COLUMN subcategory_id SET DEFAULT nextval('public.subcategories_subcategory_id_seq'::regclass);
 K   ALTER TABLE public.subcategories ALTER COLUMN subcategory_id DROP DEFAULT;
       public          postgres    false    239    238            �           2604    16563    superadmin id    DEFAULT     n   ALTER TABLE ONLY public.superadmin ALTER COLUMN id SET DEFAULT nextval('public.superadmin_id_seq'::regclass);
 <   ALTER TABLE public.superadmin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    241    240            �           2604    16564    variantproducts variant_id    DEFAULT     �   ALTER TABLE ONLY public.variantproducts ALTER COLUMN variant_id SET DEFAULT nextval('public.variantproducts_variant_id_seq'::regclass);
 I   ALTER TABLE public.variantproducts ALTER COLUMN variant_id DROP DEFAULT;
       public          postgres    false    243    242            �           2604    16565    vendorproductorder order_id    DEFAULT     �   ALTER TABLE ONLY public.vendorproductorder ALTER COLUMN order_id SET DEFAULT nextval('public.vendorproductorder_order_id_seq'::regclass);
 J   ALTER TABLE public.vendorproductorder ALTER COLUMN order_id DROP DEFAULT;
       public          postgres    false    245    244            �           2604    16566 
   vendors id    DEFAULT     h   ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);
 9   ALTER TABLE public.vendors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    247    246            �           2604    16567    vendors_notifications id    DEFAULT     �   ALTER TABLE ONLY public.vendors_notifications ALTER COLUMN id SET DEFAULT nextval('public.vendors_notifications_id_seq'::regclass);
 G   ALTER TABLE public.vendors_notifications ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    249    248            �           2604    16568    withdrawals withdrawal_id    DEFAULT     �   ALTER TABLE ONLY public.withdrawals ALTER COLUMN withdrawal_id SET DEFAULT nextval('public.withdrawals_withdrawal_id_seq'::regclass);
 H   ALTER TABLE public.withdrawals ALTER COLUMN withdrawal_id DROP DEFAULT;
       public          postgres    false    251    250                      0    16637 	   admintags 
   TABLE DATA           ^   COPY public.admintags (tag_id, tag_name, category_id, subcategory_id, tag_values) FROM stdin;
    public          postgres    false    252   DG      �          0    16408 
   attributes 
   TABLE DATA           _   COPY public.attributes (attribute_id, vendor_id, attribute_name, attribute_values) FROM stdin;
    public          postgres    false    216   H      �          0    16414    audioheadphones 
   TABLE DATA           1  COPY public.audioheadphones (product_ah_id, ad_title, description, images, price, currency_symbol, city, state, country, brand, category, vendorid, is_featured, is_sold, is_negotiable, created_at, rejection_reason, status, updated_at_product, uniquepid, category_type, subcategory, condition) FROM stdin;
    public          postgres    false    218   �H      �          0    16425    cameraphotography 
   TABLE DATA           3  COPY public.cameraphotography (product_cp_id, ad_title, description, images, price, currency_symbol, city, state, country, brand, category, vendorid, is_featured, is_sold, is_negotiable, created_at, subcategory, rejection_reason, status, updated_at_product, uniquepid, category_type, condition) FROM stdin;
    public          postgres    false    220   �J                0    16719    cart 
   TABLE DATA           �   COPY public.cart (cart_id, customer_id, product_id, quantity, created_at, updated_at, product_color, product_size, add_ons) FROM stdin;
    public          postgres    false    262   M      �          0    16436 
   categories 
   TABLE DATA           �   COPY public.categories (category_id, category_name, category_description, category_image_url, category_status, created_at, updated_at, category_type, category_meta_title) FROM stdin;
    public          postgres    false    222   N      	          0    16691 	   contactus 
   TABLE DATA           [   COPY public.contactus (contact_id, name, email, subject, message, "timestamp") FROM stdin;
    public          postgres    false    258   �R                0    16896    currency_rates 
   TABLE DATA              COPY public.currency_rates (rate_id, from_currency, to_currency, exchange_rate, markup_percentage, effective_date) FROM stdin;
    public          postgres    false    273   }S      �          0    16445    customer_follows 
   TABLE DATA           ]   COPY public.customer_follows (follow_id, follower_id, following_id, follow_date) FROM stdin;
    public          postgres    false    224   �S                0    16701    customer_wishlist 
   TABLE DATA           ]   COPY public.customer_wishlist (wishlist_id, customer_id, product_id, added_date) FROM stdin;
    public          postgres    false    260   T      �          0    16450 	   customers 
   TABLE DATA           =  COPY public.customers (customer_id, given_name, family_name, email, password, phone_number, address_line_1, address_line_2, city, state, zip_code, country, bio, verified_with, created_at, updated_at, status, picture, google_id, facebook_id, verification_code, verification_expire_date, customer_loggedid) FROM stdin;
    public          postgres    false    226   �T      �          0    16459    laptopcomputers 
   TABLE DATA             COPY public.laptopcomputers (product_lc_id, ad_title, images, currency_symbol, city, state, country, brand, category, vendorid, is_featured, is_sold, is_negotiable, created_at, subcategory, rejection_reason, status, updated_at_product, uniquepid, category_type, condition, skuid, mrp, sellingprice, localdeliverycharge, zonaldeliverycharge, nationaldeliverycharge, weightkg, lengthcm, breadthcm, heightcm, countryoforigin, manufacturername, packerdetails, additionaldescription, searchkeywords, salespackage, keyfeatures, videourl, modelname, processor, ram, storagetype, storagecapacity, displaysize, screenresolution, graphicscard, operatingsystem, connectivityports, batterylife, keyboardtype, touchpad, dimensions, weight, warrantyinformation, isvariant, quantity) FROM stdin;
    public          postgres    false    228   X      �          0    16470    mobileelectronics 
   TABLE DATA              COPY public.mobileelectronics (product_me_id, ad_title, description, images, created_at, updated_at, price, location, city, state, country, currency_symbol, category, subcategory, condition, brand, year, is_featured, views, is_sold, is_negotiable, vendorid, rejection_reason, status, updated_at_product, uniquepid, category_type, modelname, processor, ram, storagetype, storagecapacity, displaysize, screenresolution, graphicscard, operatingsystem, connectivityports, batterylife, touchpad, dimensions, weight, warrantyinformation) FROM stdin;
    public          postgres    false    230   �Y                0    16769 
   orderitems 
   TABLE DATA           �   COPY public.orderitems (order_item_id, order_id, product_id, quantity, price, product_color, product_size, add_ons, currency, order_item_status, cancellation_reason, statusupdate_date) FROM stdin;
    public          postgres    false    265   I_                0    16744    orders 
   TABLE DATA           }   COPY public.orders (order_id, customer_id, order_date, total_amount, currency, order_status, order_updated_date) FROM stdin;
    public          postgres    false    264   f`                0    16807    orderstatushistory 
   TABLE DATA           \   COPY public.orderstatushistory (status_id, order_id, order_status, status_date) FROM stdin;
    public          postgres    false    269   <a      �          0    16482    payments 
   TABLE DATA           �   COPY public.payments (payment_id, customer_id, order_id, payment_date, payment_method, payment_amount, payment_status, billing_address, billing_city, billing_state, billing_zip, currency_code, payment_source, vendor_id) FROM stdin;
    public          postgres    false    231   jb                0    16793    paymenttransactions 
   TABLE DATA           �   COPY public.paymenttransactions (payment_id, transaction_id, order_id, payment_date, amount, currency, payment_method) FROM stdin;
    public          postgres    false    267   �c                0    16822    productreviews 
   TABLE DATA              COPY public.productreviews (review_id, product_id, customer_id, rating, title, content, review_date, review_media) FROM stdin;
    public          postgres    false    271    d      �          0    16489    products 
   TABLE DATA           �  COPY public.products (product_id, product_name, description, price, quantity, brand, product_images, vendor_id, featured, product_tags, product_variants, add_ons, created_at, updated_at, product_type, discount, size_chart, product_status, rejection_reason, category_id, subcategory_id, product_care, currency_symbol, weight, shipping_fee, ratings, review_count, weight_unit) FROM stdin;
    public          postgres    false    234   6e      �          0    16500    social_logins 
   TABLE DATA           Z   COPY public.social_logins (login_id, customer_id, provider, provider_user_id) FROM stdin;
    public          postgres    false    236   kn      �          0    16504    subcategories 
   TABLE DATA           �   COPY public.subcategories (subcategory_id, subcategory_name, subcategory_description, subcategory_image_url, parent_category_id, created_at, updated_at, subcategory_meta_title) FROM stdin;
    public          postgres    false    238   �n      �          0    16512 
   superadmin 
   TABLE DATA           ^   COPY public.superadmin (id, email, password, "userId", role_id, "position", name) FROM stdin;
    public          postgres    false    240   ~                0    16656    support_ticket 
   TABLE DATA           ^   COPY public.support_ticket (ticket_id, subject, status, "timestamp", customer_id) FROM stdin;
    public          postgres    false    254   �                0    16671    support_ticket_messages 
   TABLE DATA           x   COPY public.support_ticket_messages (message_id, ticket_id, customer_id, message, "timestamp", attachments) FROM stdin;
    public          postgres    false    256   ׀      �          0    16518    variantproducts 
   TABLE DATA           �   COPY public.variantproducts (variant_id, product_uniqueid, variant_mrp, variant_sellingprice, variant_skuid, variant_quantity, variantsvalues, label, vendori_id) FROM stdin;
    public          postgres    false    242   Z�      �          0    16524    vendorproductorder 
   TABLE DATA           �  COPY public.vendorproductorder (order_id, vendor_id, product_uniqueid, customer_id, order_date, total_amount, order_status, rejection_reason, product_name, customer_name, product_image, customer_email, customer_phone_number, created_at, currency_symbol, payment_method, payment_status, city, state, country, brand, category, subcategory, product_type, transaction_id, commission_fee, withdrawal_amount, refund_amount, fees_paid, tax_collected) FROM stdin;
    public          postgres    false    244   0�      �          0    16532    vendors 
   TABLE DATA           �  COPY public.vendors (id, country_code, mobile_number, email, password, brand_name, business_model, products, trademark_certificate, company_name, company_city, company_state, company_country, company_zip_code, shipping_address, bank_name, bank_account_number, bank_routing_number, bank_account_name, bank_branch, bank_swift_code, registration_date, mobile_verification_status, email_verification_status, status, business_type, registration_number, tax_id_number, business_address, business_phone, business_email, business_website, business_description, facebook_url, instagram_url, twitter_url, linkedin_url, business_logo_url, business_license_url, return_policy, shipping_policy, terms_and_conditions, payment_info, shipping_info, support_contact, categories, average_rating, total_products, total_sales, support_contact_1, support_contact_2, vendor_profile_picture_url, brand_logo, useridvendor, vendorname, email_otp, mobile_otp, reset_otp) FROM stdin;
    public          postgres    false    246   U�      �          0    16539    vendors_notifications 
   TABLE DATA           Z   COPY public.vendors_notifications (id, vendor_id, type, title, message, date) FROM stdin;
    public          postgres    false    248   S�                0    16545    withdrawals 
   TABLE DATA           �   COPY public.withdrawals (withdrawal_id, vendor_id, currency_code, amount, withdrawal_date, status, bank_account_number, bank_name, bank_branch, created_at, updated_at) FROM stdin;
    public          postgres    false    250   �      4           0    0    admintags_tag_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.admintags_tag_id_seq', 30, true);
          public          postgres    false    253            5           0    0    attributes_attribute_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.attributes_attribute_id_seq', 17, true);
          public          postgres    false    217            6           0    0 "   audio_headphones_product_ah_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.audio_headphones_product_ah_id_seq', 7, true);
          public          postgres    false    219            7           0    0 $   camera_photography_product_cp_id_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.camera_photography_product_cp_id_seq', 31, true);
          public          postgres    false    221            8           0    0    cart_cart_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.cart_cart_id_seq', 16, true);
          public          postgres    false    263            9           0    0    categories_category_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq', 67, true);
          public          postgres    false    223            :           0    0    contactus_contact_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.contactus_contact_id_seq', 4, true);
          public          postgres    false    259            ;           0    0    currency_rates_rate_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.currency_rates_rate_id_seq', 3, true);
          public          postgres    false    274            <           0    0    customer_follows_follow_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.customer_follows_follow_id_seq', 19, true);
          public          postgres    false    225            =           0    0 !   customer_wishlist_wishlist_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.customer_wishlist_wishlist_id_seq', 10, true);
          public          postgres    false    261            >           0    0    customers_customer_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.customers_customer_id_seq', 67, true);
          public          postgres    false    227            ?           0    0 !   laptopcomputers_product_lc_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.laptopcomputers_product_lc_id_seq', 105, true);
          public          postgres    false    229            @           0    0    orderitems_order_item_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.orderitems_order_item_id_seq', 10, true);
          public          postgres    false    266            A           0    0     orderstatushistory_status_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.orderstatushistory_status_id_seq', 18, true);
          public          postgres    false    270            B           0    0    payments_payment_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.payments_payment_id_seq', 5, true);
          public          postgres    false    232            C           0    0 "   paymenttransactions_payment_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.paymenttransactions_payment_id_seq', 3, true);
          public          postgres    false    268            D           0    0 ,   product_mobile_electronics_product_me_id_seq    SEQUENCE SET     \   SELECT pg_catalog.setval('public.product_mobile_electronics_product_me_id_seq', 350, true);
          public          postgres    false    233            E           0    0    productreviews_review_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.productreviews_review_id_seq', 7, true);
          public          postgres    false    272            F           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 65, true);
          public          postgres    false    235            G           0    0    social_logins_login_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.social_logins_login_id_seq', 1, false);
          public          postgres    false    237            H           0    0     subcategories_subcategory_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.subcategories_subcategory_id_seq', 188, true);
          public          postgres    false    239            I           0    0    superadmin_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.superadmin_id_seq', 23, true);
          public          postgres    false    241            J           0    0 &   support_ticket_messages_message_id_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.support_ticket_messages_message_id_seq', 26, true);
          public          postgres    false    257            K           0    0    support_ticket_ticket_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.support_ticket_ticket_id_seq', 11, true);
          public          postgres    false    255            L           0    0    variantproducts_variant_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.variantproducts_variant_id_seq', 21, true);
          public          postgres    false    243            M           0    0    vendorproductorder_order_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.vendorproductorder_order_id_seq', 10, true);
          public          postgres    false    245            N           0    0    vendors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.vendors_id_seq', 53, true);
          public          postgres    false    247            O           0    0    vendors_notifications_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.vendors_notifications_id_seq', 22, true);
          public          postgres    false    249            P           0    0    withdrawals_withdrawal_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.withdrawals_withdrawal_id_seq', 6, true);
          public          postgres    false    251            $           2606    16643    admintags admintags_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.admintags
    ADD CONSTRAINT admintags_pkey PRIMARY KEY (tag_id);
 B   ALTER TABLE ONLY public.admintags DROP CONSTRAINT admintags_pkey;
       public            postgres    false    252            �           2606    16570    attributes attributes_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (attribute_id);
 D   ALTER TABLE ONLY public.attributes DROP CONSTRAINT attributes_pkey;
       public            postgres    false    216            �           2606    16572 %   audioheadphones audio_headphones_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.audioheadphones
    ADD CONSTRAINT audio_headphones_pkey PRIMARY KEY (product_ah_id);
 O   ALTER TABLE ONLY public.audioheadphones DROP CONSTRAINT audio_headphones_pkey;
       public            postgres    false    218            �           2606    16574 )   cameraphotography camera_photography_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.cameraphotography
    ADD CONSTRAINT camera_photography_pkey PRIMARY KEY (product_cp_id);
 S   ALTER TABLE ONLY public.cameraphotography DROP CONSTRAINT camera_photography_pkey;
       public            postgres    false    220            .           2606    16724    cart cart_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    262                        2606    16576    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    222            *           2606    16697    contactus contactus_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.contactus
    ADD CONSTRAINT contactus_pkey PRIMARY KEY (contact_id);
 B   ALTER TABLE ONLY public.contactus DROP CONSTRAINT contactus_pkey;
       public            postgres    false    258            :           2606    16903 "   currency_rates currency_rates_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.currency_rates
    ADD CONSTRAINT currency_rates_pkey PRIMARY KEY (rate_id);
 L   ALTER TABLE ONLY public.currency_rates DROP CONSTRAINT currency_rates_pkey;
       public            postgres    false    273                       2606    16578 &   customer_follows customer_follows_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.customer_follows
    ADD CONSTRAINT customer_follows_pkey PRIMARY KEY (follow_id);
 P   ALTER TABLE ONLY public.customer_follows DROP CONSTRAINT customer_follows_pkey;
       public            postgres    false    224            ,           2606    16706 (   customer_wishlist customer_wishlist_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.customer_wishlist
    ADD CONSTRAINT customer_wishlist_pkey PRIMARY KEY (wishlist_id);
 R   ALTER TABLE ONLY public.customer_wishlist DROP CONSTRAINT customer_wishlist_pkey;
       public            postgres    false    260                       2606    16580    customers customers_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_email_key;
       public            postgres    false    226                       2606    16582    customers customers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public            postgres    false    226                       2606    16584 $   laptopcomputers laptopcomputers_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.laptopcomputers
    ADD CONSTRAINT laptopcomputers_pkey PRIMARY KEY (product_lc_id);
 N   ALTER TABLE ONLY public.laptopcomputers DROP CONSTRAINT laptopcomputers_pkey;
       public            postgres    false    228            2           2606    16775    orderitems orderitems_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_pkey PRIMARY KEY (order_item_id);
 D   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT orderitems_pkey;
       public            postgres    false    265            0           2606    16762    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    264            6           2606    16813 *   orderstatushistory orderstatushistory_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.orderstatushistory
    ADD CONSTRAINT orderstatushistory_pkey PRIMARY KEY (status_id);
 T   ALTER TABLE ONLY public.orderstatushistory DROP CONSTRAINT orderstatushistory_pkey;
       public            postgres    false    269                       2606    16586    payments payments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    231            4           2606    16799 ,   paymenttransactions paymenttransactions_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.paymenttransactions
    ADD CONSTRAINT paymenttransactions_pkey PRIMARY KEY (payment_id);
 V   ALTER TABLE ONLY public.paymenttransactions DROP CONSTRAINT paymenttransactions_pkey;
       public            postgres    false    267            
           2606    16588 1   mobileelectronics product_mobile_electronics_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.mobileelectronics
    ADD CONSTRAINT product_mobile_electronics_pkey PRIMARY KEY (product_me_id);
 [   ALTER TABLE ONLY public.mobileelectronics DROP CONSTRAINT product_mobile_electronics_pkey;
       public            postgres    false    230            8           2606    16828 "   productreviews productreviews_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.productreviews
    ADD CONSTRAINT productreviews_pkey PRIMARY KEY (review_id);
 L   ALTER TABLE ONLY public.productreviews DROP CONSTRAINT productreviews_pkey;
       public            postgres    false    271                       2606    16590    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    234                       2606    16592 4   social_logins social_logins_customer_id_provider_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.social_logins
    ADD CONSTRAINT social_logins_customer_id_provider_key UNIQUE (customer_id, provider);
 ^   ALTER TABLE ONLY public.social_logins DROP CONSTRAINT social_logins_customer_id_provider_key;
       public            postgres    false    236    236                       2606    16594     social_logins social_logins_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.social_logins
    ADD CONSTRAINT social_logins_pkey PRIMARY KEY (login_id);
 J   ALTER TABLE ONLY public.social_logins DROP CONSTRAINT social_logins_pkey;
       public            postgres    false    236                       2606    16596     subcategories subcategories_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (subcategory_id);
 J   ALTER TABLE ONLY public.subcategories DROP CONSTRAINT subcategories_pkey;
       public            postgres    false    238                       2606    16598    superadmin superadmin_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_email_key;
       public            postgres    false    240                       2606    16600    superadmin superadmin_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_pkey;
       public            postgres    false    240            (           2606    16677 4   support_ticket_messages support_ticket_messages_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_pkey PRIMARY KEY (message_id);
 ^   ALTER TABLE ONLY public.support_ticket_messages DROP CONSTRAINT support_ticket_messages_pkey;
       public            postgres    false    256            &           2606    16663 "   support_ticket support_ticket_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.support_ticket
    ADD CONSTRAINT support_ticket_pkey PRIMARY KEY (ticket_id);
 L   ALTER TABLE ONLY public.support_ticket DROP CONSTRAINT support_ticket_pkey;
       public            postgres    false    254                       2606    16602 $   variantproducts variantproducts_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.variantproducts
    ADD CONSTRAINT variantproducts_pkey PRIMARY KEY (variant_id);
 N   ALTER TABLE ONLY public.variantproducts DROP CONSTRAINT variantproducts_pkey;
       public            postgres    false    242                       2606    16604 *   vendorproductorder vendorproductorder_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.vendorproductorder
    ADD CONSTRAINT vendorproductorder_pkey PRIMARY KEY (order_id);
 T   ALTER TABLE ONLY public.vendorproductorder DROP CONSTRAINT vendorproductorder_pkey;
       public            postgres    false    244                        2606    16606 0   vendors_notifications vendors_notifications_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.vendors_notifications
    ADD CONSTRAINT vendors_notifications_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.vendors_notifications DROP CONSTRAINT vendors_notifications_pkey;
       public            postgres    false    248                       2606    16608    vendors vendors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.vendors DROP CONSTRAINT vendors_pkey;
       public            postgres    false    246            "           2606    16610    withdrawals withdrawals_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT withdrawals_pkey PRIMARY KEY (withdrawal_id);
 F   ALTER TABLE ONLY public.withdrawals DROP CONSTRAINT withdrawals_pkey;
       public            postgres    false    250            @           2606    16644 $   admintags admintags_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.admintags
    ADD CONSTRAINT admintags_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);
 N   ALTER TABLE ONLY public.admintags DROP CONSTRAINT admintags_category_id_fkey;
       public          postgres    false    222    252    4864            A           2606    16649 '   admintags admintags_subcategory_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.admintags
    ADD CONSTRAINT admintags_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(subcategory_id) NOT VALID;
 Q   ALTER TABLE ONLY public.admintags DROP CONSTRAINT admintags_subcategory_id_fkey;
       public          postgres    false    252    238    4884            ;           2606    16611 $   attributes attributes_vendor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);
 N   ALTER TABLE ONLY public.attributes DROP CONSTRAINT attributes_vendor_id_fkey;
       public          postgres    false    216    4894    246            <           2606    16616 2   customer_follows customer_follows_follower_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_follows
    ADD CONSTRAINT customer_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.customer_follows DROP CONSTRAINT customer_follows_follower_id_fkey;
       public          postgres    false    224    226    4870            =           2606    16621 3   customer_follows customer_follows_following_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_follows
    ADD CONSTRAINT customer_follows_following_id_fkey FOREIGN KEY (follower_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.customer_follows DROP CONSTRAINT customer_follows_following_id_fkey;
       public          postgres    false    4870    226    224            G           2606    16725    cart customer_id_cart_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT customer_id_cart_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 B   ALTER TABLE ONLY public.cart DROP CONSTRAINT customer_id_cart_fk;
       public          postgres    false    262    226    4870            I           2606    16751    orders customer_id_cart_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT customer_id_cart_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT customer_id_cart_fk;
       public          postgres    false    226    4870    264            C           2606    16683 *   support_ticket_messages customer_id_fk_stm    FK CONSTRAINT     �   ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT customer_id_fk_stm FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 T   ALTER TABLE ONLY public.support_ticket_messages DROP CONSTRAINT customer_id_fk_stm;
       public          postgres    false    256    226    4870            N           2606    16834 ,   productreviews customer_id_productreviews_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.productreviews
    ADD CONSTRAINT customer_id_productreviews_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 V   ALTER TABLE ONLY public.productreviews DROP CONSTRAINT customer_id_productreviews_fk;
       public          postgres    false    4870    271    226            B           2606    16666     support_ticket customer_id_st_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.support_ticket
    ADD CONSTRAINT customer_id_st_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) NOT VALID;
 J   ALTER TABLE ONLY public.support_ticket DROP CONSTRAINT customer_id_st_fk;
       public          postgres    false    254    4870    226            E           2606    16707 )   customer_wishlist customer_id_wishlist_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_wishlist
    ADD CONSTRAINT customer_id_wishlist_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 S   ALTER TABLE ONLY public.customer_wishlist DROP CONSTRAINT customer_id_wishlist_fk;
       public          postgres    false    226    260    4870            J           2606    16776 !   orderitems order_id_orderitems_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT order_id_orderitems_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 K   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT order_id_orderitems_fk;
       public          postgres    false    265    4912    264            M           2606    16814 1   orderstatushistory order_id_orderstatushistory_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderstatushistory
    ADD CONSTRAINT order_id_orderstatushistory_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 [   ALTER TABLE ONLY public.orderstatushistory DROP CONSTRAINT order_id_orderstatushistory_fk;
       public          postgres    false    264    269    4912            L           2606    16800 3   paymenttransactions order_id_paymenttransactions_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.paymenttransactions
    ADD CONSTRAINT order_id_paymenttransactions_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 ]   ALTER TABLE ONLY public.paymenttransactions DROP CONSTRAINT order_id_paymenttransactions_fk;
       public          postgres    false    264    267    4912            H           2606    16730    cart product_id_cart_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id_cart_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 A   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id_cart_fk;
       public          postgres    false    234    262    4878            K           2606    16786 #   orderitems product_id_orderitems_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT product_id_orderitems_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 M   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT product_id_orderitems_fk;
       public          postgres    false    265    4878    234            O           2606    16829 +   productreviews product_id_productreviews_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.productreviews
    ADD CONSTRAINT product_id_productreviews_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 U   ALTER TABLE ONLY public.productreviews DROP CONSTRAINT product_id_productreviews_fk;
       public          postgres    false    4878    271    234            F           2606    16712 (   customer_wishlist product_id_wishlist_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_wishlist
    ADD CONSTRAINT product_id_wishlist_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 R   ALTER TABLE ONLY public.customer_wishlist DROP CONSTRAINT product_id_wishlist_fk;
       public          postgres    false    260    234    4878            >           2606    16626 ,   social_logins social_logins_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.social_logins
    ADD CONSTRAINT social_logins_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 V   ALTER TABLE ONLY public.social_logins DROP CONSTRAINT social_logins_customer_id_fkey;
       public          postgres    false    236    226    4870            ?           2606    16631 3   subcategories subcategories_parent_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.subcategories DROP CONSTRAINT subcategories_parent_category_id_fkey;
       public          postgres    false    222    238    4864            D           2606    16678 (   support_ticket_messages ticket_id_fk_stm    FK CONSTRAINT     �   ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT ticket_id_fk_stm FOREIGN KEY (ticket_id) REFERENCES public.support_ticket(ticket_id);
 R   ALTER TABLE ONLY public.support_ticket_messages DROP CONSTRAINT ticket_id_fk_stm;
       public          postgres    false    254    4902    256               �   x�5�A�1�s�[��3���'��U��F'L��x�X����x��0�Re��0t�8�$?�b���M9>]��ϕ#|��#����|o�}���_.�0�?p�M����nC�����bbe)6��6����E*ֻ�O���5o}���\}�v3�C���qV�lOT?���9�0�H�      �   �   x�5�M�0���,��;hb�ƅBۙR$�4������{���p�_�~�}[T)t�����PO:M�.*�`_�P�;���fL_��$Ħ�58���H39{�r	��:�&h
|�S�g5�� "9��1���$u��#ďCBGZ
īB�i��v��#��(��� ��дMh��)�~�5K�      �   �  x���Kk�0��׿B��Bmt%��]��>hҐ!���ؚ�&ci��iC���]dʹ�"��=�;W*a{G>9���\�����ػ����c"��黱#�4����G`����=\�ݭ�pa[�l�����x;W�;W)_�����(�959r����*Y!j�`u	�8��*�f��ލ���ՉI�n=�[߷��$|Y|=EX�~ ���HaUS=�7�b��)���������c����S�9��J�J��=	����)�I��G,I�:�9��S16dh�+GD���������R��Z�U ��cb�ME˂��Ñqq>�K�#���ZR:ŝ��&v�>l��5g\�R�r�o����ROS��ٹ��V��(�������@\�wۻ�M�RHYr43�w������1ܟ���?��j-���E!QJX�t��s[n�ߕ��,�~�` �      �   v  x����n�0�מ��1�̲I�FU�HQw�0��<��뙤i&I�G��}����9� 5�j|Y�~B"���� �v�:p������h
��I1e��$���ˌ��S�88S��o��To&�MO�����U��4윇���s�z�Wƭ����֝.��z��p�7N�Ꮇ�7��dHx�EH"J0ᄃ���XP�V�>���D��й�>�m�Ӄ�u�+��Q����J�����Z$�j�0$4c<�i��2��b�Po�G[� Z�*_B���л��T^d��h@�����(�H�Ę���^qH��?Rc�1�R���o4��q�F��~p�U;T��v:<����ֶS����uQ=�|?=�E��y�|��'"�"��t_�ψ,U'��Zψ\�|��rFdk�{U�jFd��]�ݎs"�}N���#R���tk���cd�R&љ�*��qS�MHC0����t'>�$�X��qD(��|����_$�4�fp����J��5��)��X��ޥs�Vh׏�p$9�ȣ�Q�
ժi�0!�����_r!�l6˼"O5�G˼"���#�,�v>�u{��Ԋ�'D�����ݴt�7�I/��L0��$�a���)I����h�X�bz[
         �   x����n1���S��cKd;����qA�{j��K/��OX
hw�$�\�Q�ˌCf���DK䆰(�%<��������W��\����-j(���	�=��
�3�)�ԅQ�a���g��{��xo�������\�Y4b��X���<�E��tc*b��S0C�����XHU�WC�����1���L�۪ϗC�I[�:z�;a�Yر.�0��Z��t|��u+e�&�ܫw��b���      �   p  x��W�R�F]7_���r��U�R<<�yA���,���Jd�#�6�}�� j˒�I
Eq�����s�}v�Iݺr���B|Ո��Ď)�(�%���\#��Fr���*�!��_F��4��V��w��zUœ�v����t+�S��Ts��HF���Ǽ,�Y	O5�RDhDiLD�%fZΆ���g�~Q�Ьpi]�e�Vhz�W|*�pQ��(���:�\�����w�a�Bhk�Ľ3���鈒���QL%�ZAm�\��n��s�,��*�_�ܽ9��N����e��跤�ܲ�XpL��FA�F�.)�9P��d]?�QK���D�!(�6��v�}��1�+Zr 
x-�]��n���u�}�#?��4��`�����Ag��Ր��I�Zp�}ڹ�L�e�!(`���ٮ�W&��u�kN�CP���������|<̬be%��N�������u���7���*la{ֳ��%��P�Oy�S�9�510�CP@+����[s���{p��jU􎣊��t��g(tZ�p��/G��~v)�V��ΰ���%�þ���F��LN��s���S�ř����Z,�1| 	�־��iS�dy8~�}��`��|jSK����<�R^-��\�|@�~��8��D
�a�J�F�Px����JN:NԆ��)���*p���015��d���P@��lu8*jJ��`�P�,��}s�$/�؅��2֝�6�C���s.96Z�C%y�j�SM�~��%D�c,D6�s�m(8F�3h�EN%������m( 7/��
�QX���TY���6�`�Z�Zp�]R.{s��\ck��tOi�+H�݆pT� Qj
�)�^&W�������{�61�0Ք���P@��%��"ɚP8/����v`���R�_� 
�9�����y�8b��:$�j3B��.ȗ7PfL�����C������Su�OV)k;-҆�'(�^#�B��O��U��}�KMl��I�M��n�Gu��n�ή*?��8�g����߿n�T��|J��S=*�d�r�ʳ),A��E%c"#
�3�.�Z+�:5��@�|��H���'L�f鷚��-�0��y�(������Lo�����W�IC�@���ᓓ� c��|      	   �   x���=O�@���+���|iC&�B�KU!F7�6�r�*��ߧTB0�:��~-둍�߰�ړpG��z��E�N7)�y��1�$d�~���[�f$at
�i�/��6Bבs��kX���`Q���8ckS��VW�*kn����ܟl஡�������;rZ�T�a����Hx��2�a�#��h�6��� �O�/��f��w_uQ6-��         e   x���!1P���l��i�h�;8�f�������K�r	ԅ�of��f�*.M�~E���ԇz'�����P��L���V�Τ�񥭵7� �      �      x������ � �         f   x�m̻�0�Z�"}`��/r��?G�@n���>@�`�/�6ovZ�U�oŔ��y��$��:ܟЊ"��6��fC�<u���?�%�+�М�S&%�      �   {  x��T�n�H}n�«��a��}s�mi� 	�n$e�؍1���@�h�}m���F�m��ʮ�:��I@k.b0�OL�R1dBJO�H��&8��OV�f�5'_E6�0K]��^��R����*�G��<Λk�tAq���T�-�"j�g��������*��i�r w����}�B�O�SL߅��P�Uoqs��J���*���k�
#χՊң�ӧ[�&^�G�~M�n��H?��^�Z��JtjY���\��<U�a�s�������$�e���a����Wӥ���8���Ŧ����&?���M���Kkw��ă�?�fU �8�&f6d����h�Q�F��r�T{c9O�G�[�y�gv7�/�˻���܎�ɶu���A+C�ӯ���.���:##%���B�g2[�I Fq�KO�"��-l�eB:����3�L�ٛ�"�9���垜������L�?�4�0�JwTi�uz����A�; �N�4a:��>��G��0�y-S����v��<DT(�W��2��tr��m���
�ir���6Ÿ��7�3P�Lʂb�������x���H��t��`D��r�Ѕ鷍��"ow��؈��n�ǫYͨ}���pў�� d&)�0-� �dG�Bȡ��w�1�B\B����ncB!;�P1�ȁ���N�4�*O"�U{Y2BYE��BZEK���%n�d��ɭ/R�EJ�Қ/i��������ڨ5�:���+�5/��y��|�rSx,%�q�GX0�&��ItD���@�K�V��?��M[��0,'�]jgr#�$��;*���8�Ÿ�.LK*��e��ą2���n���뇈D��B��`���9�E�o��^�T�˒��      �   �  x���=o�0���2t�@R)j+�ni�H�,���"iI�t0��s$%�Rd(|��zy����j�ڨ����~�^ͳ�ṛڮ�<�����aQK3���p�q���;���FX��dOh²����TJ.��{5.Ø|I���ui����C�R���~=.�o4PJ�Q0--��1�lM������� �Y�!X���F?�梃(�7��НF� �QR�U��V�����2�E^�tB��K~��o�Ԍ����~=6�g�h2%\J��E��B���ߎ��
��YY]#-k��c�I@EH[bW�V�ܪ0��xn�M�.߄g5u�_�l�۽C���ʕZ�b�vHǾ��oj�UD����G(��OhQ��*�4'��%��PY�{�/��q��u��!�����[7j�~O��~���ֶ��K���� Ԃ/�      �   a  x�Ř[o�6ǟ�O����f����>���]ҬiQ`0(mі%O�ư�#+qnJ⨵�-��;�sx8S�ps_���<*�E�g�-\�]6r�JN�ʕ����>��n�dy�OV��W	�%���7XD���q��.@�Re���sm������M0]L�C�0> f�(�$�,�:0��Ld�IG�	1B_���ctT��#���$*�2����b�/���0u���3?*�Q�����E���T��~M��
/��ǿ`�Gq����Q"z�J�2$:$,�Zj����f��\�i��.ue�ߦ��� �⼎K4̦�
'~���a)�
Gu�se1���e��.M�ʦyo:�Nw�8�)�X��q;2���S���k�I^T�9<�$�p~e3���^�u�c��#W��yZγ�>��7�>���jM}�L2�Sh\N����a�{������m�r�v���O���	��WY���E�
t8J�[����s�Giy��qlz����U�~2_�E�N ���W�!qQZ%�p��l���MwO�Sы6W�W���*��V�n� ��$]�|�ˍel�j���Xk���/��k�j��|[�;S�5m.��E[�=�]��}W���~*�?��N��ڋ/}��BiC�c��Ё��!w��hf��[h*x���e/�[���-�|Ͷ|w픐�_�����C�E�s[���,4��X��5�FXe��`����r�� �鵐�1����W\�J��sb_\a�I�����j�cJCaC"!��>w��U�hn~�On\�L\�X7��ϐ�APXy\����%{�ml�v�S�������,���Y]{���ok�Eɀ���!mHE ���� ��D�B�%_�*�Vkb�h��b� u>��˧+�!,�����	l��Oa�Rv��9e�%�E�/}�p���{�М�>��E�h�_���\�z�(�(_��/�C�`��	�Dsb	�-����M�,�ʙeW=�3gޕ�-:\��?��]/��^��&%v�BW�b�.��8�&nU��*$,$&� C�'�{sF�[��.g�I-)xu({��q�WS����]����Vx����$�QVmʭ�"ͣG��gW��k��恌�IA�O)��a���8�@�"!��W �7jw�`!��]c��+�0��)�����pփ�E�ï�`ɂe�a�2�, ��zy@�l�:�<�p�$�cw�>f�$���r+�0=�j��u�0���j4��G�*���	��A�� ��P߫��oy>�ۯN�7���"r{-�1�2�?!ۦ�Ҿ�Q��w�O�:�]9z�x���zJ<�?m���F��&�HE³�,��o^�
�H�׈nz��,888�3|           x����J�@Eם�q���]���R!�ą��1:��I&&
jt�]�ԭnT(�jv�ʈ"��Չ�%��ͥ�$/�f_<Ter'�����/^Umٴ��1_G4ǙW��P~��������m2k�@����.>	�W�+�1J 	�)��S0�!2�g�؃=�p����@��j�9�?ߵu��T��nH@��T{gH�v�`��-������XL��>h���n���0X'l���hq`��G�n�!|�����6��ϙQ��Q�F�ӹ         �   x����JCAD�Oq��e��۟�*���e���
��Fn���s؏�h��)"	D��:�v�C�6�H����sz�X^�����h3�ݺZF=/&�M�jC��L�]4��, ������
o�b2�)tmי�-�e��hWtW�B�rC�r�;���O�e\�~�W�����:���Ў���G�w݀��^�4M_��cX           x����J�@�u��K�s��V݋k7��6��T}{s�*�@Ja����m�b�=q�P������p�wJ����}iNo���H�#z#*���=���O�y�>�{n)�5Dn��ٻ����O��+�]w��ܕ�_اjD1�#���yx#����I!dl9A;����%�ѫ��<%������a���C�C��5�!��h*�0D ��'(�3���h��Ɉ�B��N}���u�\/���ӟ ��y1n-A�3p�ag�Y��m�ӱq��{2eY��7��      �   !  x�m��J�0��O�����I���ͪ(�9�ބ5ΰ.�D��&sX���$?��� &�*'�(��"��9/M��Yǋk@�)޷\�`z���mm�J"𺺃��?��퀋L��t9�%�i�.����;am�뼸:��_�>9�O�5� Os��p8Nx:����He%�?��yI�tf�gslm�?������b���x���@�P#A��A���`a�q�=,6)3bP��
G|2���ug|�Ú���w�.����2bl��m�,C��{�e���z�         u   x��̱�0����)�	�{K�nX%qqPG�B����k�!&��/e8$�	C߃>���S�5d_�"|ԮU�]4��r�T��zW�Y�S�%ϻ2mr@��E����x��)�Ky�ι�0�           x����N�0�sy�f�J��ǔ��b<xd���+P��ȲkL��s餇�f�h$�D��*Ԟ9Ҽ����jK^=�\�w�>��CՔ�/���f���!��1@��@:mrk����I�S�<'(rF����6�6|��rX(�\䩯��ӥf��0>]1�±�K��o]h�:�Q	��K>WK��m��8�/N]��G\we�QY�n_k=�F�q_+����v�2��N��0񻓬G��i�������aFp�/Nʢ(��^�      �   %	  x���o�8�����F��	�ml^N�Su;ZU3;W]gO��V#�%��t�Y��~�	�IJwS�s�e��)�<���<|y�0�8��2k��lԲJ�Bo�T��D
$S��@�F��@�r��Q�iQ�eҡϙL�P֠X��ż
�+��fw�a[�iY���ʅ���Y�g>���c����%�Uu
�Fa�ɾ��?�~>S���nv��e��S)���*[&f\QeWfX._��9|�,_��B��eYDA7oҲ��"�7A.�O��	�]��"�e��C}�kN��E��/����؄w��]�ٰ�9�&��h�R��F���1e�g���A�feqk�j�9��Z)�Ŷ��}�Y��D����|���tC�����eY�u���"(���a3�j.Ų�'�2_��ǰ:�D�%�'U�S��m{�s��\
	�3���yV@�BΫ�Ӡ�<�dY��L}
*�\A�&���aU�-E!?Q�&d�9���xaψ����	'�������ʬ-XS���Kak��m!ح���"L|���5mL-��f1�Z��`39e6�'����f�6b��
Uuy�E����@qY��%�;4tO(��D��B���Z���?/�����^:�� �2~�}-� WU�
�"��VW�țm��Q����g���e�΄4�d+ʡu>���e}MV��/|�W��
�[XO���ګ6����=
5����Ra%`^�a��qY���������2�N���gEP3Uh)RQDY��5@},F��DUa؇�u��_~T/�FP�v2K��M�4��^�J���D��)��\�]�E}��vl��r5��\,��^0����8�J`�D-x�8�0U6�v	�PTw����l͑���Ys%��pǙ��5����G�aԬ���C�i?�0?4qU�w���v����G��QηI�����o[�kϻ����.P&�K��AU���.85�8�?�*�R�N"X��������}���.���ʝ�y׀q}\��W���:��R������b��Ӯ�����ψI�+����}����a��x��8u�vq��Ӹ�ÓlW��kx��x�x��xfl"�F��Cn
��(����y�h�}�s�}����;a������F�w|�971v����l�tl�}��O�������Ҋ�F�>��F�F�S)&l7t���M}��ı]�n�����D��a����4����̞G�D�)��Z��m�8ygԲ3X�ߟ|8рՀ}nc4`�S��=7$7K6�M�)��?�Bh�	�2%Z3��e
4Cp��W�pz���	����x�x��⚼a�U�V|%�����a����uLc،`�,�� u|�L�ĻC�U*!�15-~�H8�n�ɮ�5<e'��H$pɟ�-��2�q�w�V*�u�-t�;Y�/�j��Ԉ�2F#���g��|��[��Ѯ�Ү��J���Ndm�C��&頁< A��O����J���=���]�>�]�Ṋ�Â�Nj�rt[B}��`���i<Q�Y�����H�Q;�PKvJ���:f�T��6��Y:d��/c4����{*?Т��N��c�Ά=*`��x�x���rg@�e@���8��4M�.M�4V��q�Jz���8�ԦD=��乍���H�[l��Y'1��ٱ��mfz��;�"��ns �z����#u������]�l�$j��h���@�4��6�d��NzUdS��S�S�S��o���߅)�)S��g{p�Mߴ�UވE��BǓ�~U�*�@޷o�6%��ɽ��Ʈ��^��{P�%�t�x1�����7��Qӣ�������D�9ݵ]kpg�%��>�߽0F����{���G���J֣�{��s|l�̃�'�����C����&~�~�~���&|=��&��ɫ�{K^fS<��2�f\e�X~^�>0����ی�Y4u5u��M�ã��h��(��bL�[�`s��*�[6�|r�/e����([�d9�@�N�@nf�j^
 )��(
��-"5EQ�B�HDf�c9t���*4]5]��M�C�+�f"�ݘw���G�&c̛i=��	�⎻�1��cY�NE�����j�2��?$�h*�uv(("��l�,�鹚;�Z ���D'yS�s����TJY�^�U��@�lƏ)��!T��M�"f*�h/����~#4��#����tw��Lw�{�8�M[h?��ȳ���A��韮@�ˈ�'���}�~�����q�i2� ���I�^_.��/��8I��K.��v.��7j����£��`�����p ������+��      �      x������ � �      �   i  x���Isܸ���𧨓�$
��ǄmYv{մ��w�(��V��G���?�dfmd��z�툖�/��� 0��H�l1{�ey�Tu�7l�*�$�ꄇ�f	q�u"��BLI����������jf��|��O�L�ee~JB��3�/Ӧ5S����S"��R$�i�프@��{����T�$(n݀�	��]y��|fD���2Ů0��ź.�v]�X�M
J��\E�u%�	����,�:�O~�Z-���v_=��2���x���%� �=;ϳ��)���F�+!M��Z6`����It��M( S��^��>���jQ�yH��h�Usvz����4�:_UIVݟ6����H�;M���2}ZM����n��	3��d��&�K��^vF+�˄s炦o���(��|I���j��w���5pXWB�aҢF�(K�\���AB�e0N�v��"_.a��Q��0m�D�� ұ�:��_`��xZGSN�!���I�R�&�iӶȒ��Z�����g-M骜�X�A�H��+�h�I���gz�(�?!q�ypN4±��}^�0J�����u�Z`ܜ�)��	�=���	�o�V���K�"���sW��t�V+0�mu�Z�yݰ���Ak|8�8��uUY3���N��^z�p�y�i4 Z}�n�e>{w�>oH�0�����I�H�y>j�p�[�%��u4$JwrYZ6�M��5���/���y{�
��Z�^��ie��-��C�+�y���Zp����C^,G0:q�)��:ov0�������j�~h��C��ܙ	���Y���ZT��<:#� �Y��4go�9�����<�O %ǌĄ�@����׳�U#�{����ohACT6�LI����� �f����?�b�َ�,����G��+!=��[��uu��F�����ƫ)	���s00]�C.D��zJB�`iVsg�`	��	m���J��u�U9�(�P�4��5���.;P�`E���@�7UZ���C�mfiy;�\��=��X%Y!���+!Z�o��<���Q�T�����+!ΰ?����a J��Kp��q+D 弈�+!ֲ�iI5	X��'}�� !����J�����a�ZGA�"k�b=�(Z�1p���a��䇥�yA�)PtK!]\�w%|A�D��x�`q�?���z�r�Ȩ��J ���}ʖ�@;��h�!���A8H��jUհ��$���S/��}���缉��+!\�o����ת<��������L!D��_:0r��	_��U���	�o?Y>�Zck�o����ʹhh��5{]�$��g��p��V�ݕ�k�$͛��^-:��|���>�h���Nrm"�J����=���*hI��<r䮄PX����sZ��E6a*�]n��Q��JH��L�;D^=������qHhJ�pOBd`�'W����o���ԁG!�@��޷W�8��k���1
��R	�t�=�'!Z��0 y�IE�(R�E҃�OJ��������R��H���*�I�T�Ӻn��H���8�@�d � "�},��A&fi,����"yJB��Rq|:��
Z���,����^g��}�C76��)	�����a�ۡ�8�6>����5ٓ��}O[�$Z�W�ml�TC����OOB2��z�'wD��Ê �G;e����,8g��;����g{ad����Ŏ��<��&�
;NW"����J��(S�$/�q*�I�TT����~-D^0ek��$�i���mf�Flh���cGmCaO"�aX{a�Uy�M����8�X��U��דnٗuSdH,��^ s�o�� %�*zeW"���eFtt�
F�P��pEIը8f�$���߾n����n����'�{�,=��a3&��8��8Q��+��[OB��P����9�s�8�P�������p@%�+5-\�iC��%����"�C3������lO":tpE�=�m������ݶSx-
�^QSԓ���4[��a�@�bJܬ�!���I�4�-�.��o�Ea���&�$�@���ؕkw�o�ݍ�e�����%��ҞD���b8�ւ7"ʄ=���]��7A�������AZ�=���]�C��}.拶(wM�>.���l���.�v%�J�9SxW�g�iQ���!��	n��ە���Y`Y���U}7nl@�w.���ID��Ll���}M�7������Gg^=���\���v�Wrզ�z�`(m=���ÞD`h�����	�Lǭ�N�kܾ�"�߮DpXpUQn�_�#�"�CȃDH������ն�j	��_s솕����ضw��`�!�L�p�NJ���
�;-���yZ�)e��q����Cғ��|����(M�.�|���8^�Z`����;%!^q��jShd{��S((]�����DLˤ����:��!j�=χ�k4V@S�<|ں��&���~8"/��!/�l��Dh�����yS�Ǒ\�xnF� R3�����Qm��e:a�ĉ��G��ӕ��}�.yN�i���#�Q����ʆI������{5�9f��ʨ���ID�.\��j����ҥ�-
s=�����j	�	����;G?��Փ���jS{�ڨ���_�Ut�'!Ts����2-�m�����(;�}3T�P=X�Bt�(+ �n�Uu�_z1�Ά5t�<���Dp�:��Sn�ñ�0]�DXW�=���� ��k��}�?������ʞDx�;��HB-v�(uڛ���)��&>�}��$&s\st"[v��{���ō�ഌꜞD����Nw�ܫ�.��E�ڕ�U�}�np�x?��@;D�w%��]���OC�����þlI�����#1�;n�� R �����N���$���M Hžg2Q�tx�	��Lݕ����u[Cԁ�A�c1�-�r��C��K��Dp�����^�:(A7{�£x�Wl���@h�;Ky[��]C8�/-D��@�'�2hêu��иiq��]��T�q��`e4�]���}�(߲_�BG��[�D��Q��J���ͺ)�t
�f�l;yd��B"!�G��=��aW._��,�����bx�܊i	�C�Ue9T����x��G��]4�@�3��A���
�T��Sq?Ei��$�J�ʡ���:�6wS �w�Hz��V.l׫u�iدװB�}�1���ԆG��Bp�6���$��P�b3�g����屃�$�c�+�k�|>�iM�L?���K��.�M�I��X����l~����:����:�AГ��P�����}��$�OsW"$��s����!��Cwg�푞D��6�q�c�(R�������H�ٛ<]�+����,��8o
9/� � T0�J0=��4�۞^^�Go�ǭ���aýuQd�IĖ�@A��zpS:_t�7ʆ~�q��*D�z�oh
`�5�� C��7.�Dh�>@�tKn����FC)qo^@��=H5�pK$��]ƍ�
/�B�PQ��I�������v[��O�T|��'ֱOeѢ���SA�Ɵ;PCt�o4]��~<��v�������6
]��C=X���頣k�=	���n��}z����W�:*�z���[7��Oڪ����9�DH�s��u��fs�Y�qc�嵴����DdŀX̉����C��+T������v1�Ero�K��ⴸ=���e���/~�����ˇ�}��Ϗ��ߏ��M|�x%�~��r/�W�e�ʼ\���ff�]�nfB�ޑK�!���1,���`��b~�U���}y�w��zsusw��f~H�L(��L�����4��(�+b	�'܌����?`�g���W���}���?���:E�a��x����ްt0�ſ�/^�/���H      �   �  x�e�[��@ F��_�Ml�&�a�;o��Z�(f�/� r/��f�{�t�&>�|G���-iZ V�` l���t�N��	�G}f���W���卓���8�㠼 u���f	bue9��X���I��|(|��q\��œ���@%5�<���_{|�h�����H���W��Ӛ�D�\O�R۽���͊�z��u�X��	>�O`�e����	8dV�i��Q���_���F`���C˰=�|٠�.܉sH����[fmKQ��V��K(S𾸽T��_�0��'��i�@o�Wf�ٴ�ʎ�|`��r��pם,�D�#8���g��ė�Am�s�s?0��P�Q��p�����ʗ�|5Q�uH0$	�+����f��w͸�	ӛ� �Ga/1���c�^�v�wUP��"²�#�o�WdS%�)k-܅'׽���?�;�8����6         �   x�u�1O1��9��Q#۱�bb��]�6D�����C�r-�������螏mp�V+��%1ʱ�Z�܁X��˒V#��g��u��+^鲤�����Yg���@bb -��Z�1E�y�3F8������gC����Uyr�֧�~�}�)�{��i|=��o�b@�� ���#��i���>�0��u<�����L�q�*T(_���������}�����k`         s  x��VM��6=;�B�kA�DJ�^v/������&�ĝ������RI��=��`&AqL>>>R�ta�QT�HqHu�i���I�׫����mH�)@�Yj�K�����IaiT��i���Vi�}��h�U��X��Js_*-�Uh�Ȝ�����^|��V~�y�Zi��-LAT|��]�us_"H�N��� �0�u=7�22 X}���u�$��?QT��<	�4m�A��*�q�!�/������]��}���Y�/����?��A1�cA&(TZ]*��z����6�蝁�>c�"�MiA""��
�Ph�?`����`��+����e��k��a`�	�+q�HＡ6N��Ot��C�����}hJMR�sھ!��Iqg������fes'��N�7ĂS�*+n%���o��\->P��o��ЉC��5w|�V�&��ٝЪ�PZ��b'��?�Ð�&��w��.~��/~=�X��,5o�EO��U��nӍ'罰vW��/��5�Y���ul�9�i=�c�?��qtf����#NB0����-�׏˚Y�@�(2h�q����Q:��l/�y�m�`����䬷ZAp� �p�c[��1&���1-wN�{�e�<l��N�-�BPʑ}����^/�>E�� 7�`����S�E3�Tp܀���@`���	>F휆�5���[{�r��K ͚�i�3>܍�5ӌ	/; �,��� d<� \3Y��!�gT@�q���'�������t�hYIƂ7W�//�Wj-	@\����eʜNS��=g��>x��[�n0.�>���V鯪�ڱb4!E�f\X&�$S1�6\�V2�/uj���<��7�Θ�B~r�X��iF�      �   �   x�m�?�0�����l��J��!1���B�D�������Y�',�mr�w���	�!`D�����D?���N�uU�/T�Q������s��R��#�L�,��V����zM���wM��A�l�r���f��<��}��-Jﰪb��FLP���c�r{(��!=��S%<�Qr�T"��0�1l:\�~��R?p�`�      �     x��WMo�F=O�y���˛\��)��#�֢HTR��Β�E[�4�� A��zo�{3C	A#%(\�+�/�-� �9�n�&|��u�e�4̚����x��+�s��z�Ç���&�5�Q��p;�^����v�BS�ӥ�&�k�tF�)@�4�a�e� �'�w��몼*wp˲n^2߀�C0��8hf�bZ�a�@j�, ����bZ�� ��CZ�-�%8�\�B�B�
�uw���� �0`9�X&�fA!�&���8�'+<��Q�/���z(DL�E�t��{�J0�Ό!1�M^2 4�$���I"��bܯC�VpS�!�)�s����Bz�eAyPQb�t��;C=!a��3
��~�n���n�w�|��1�94h��%x�jXm��O����8fH9!�.O"��ú���>l�\��ˤ�\�T�sy!k������T�0�#I�A��&&��jS6۾�C�n`�%Ul1�hH������K�W������}��W��E�]�v)�ã�
����Â}�(��~�V�k�8F4:�<�=%�J�i�,\�����k��z�,�[ؤ�$rt�@F"��A��1����:�������b�U��Z��\����6�X7%0�����3k��]D��yZ�\����~="@~%Է�����p�}Jn>W���18�N(��P;fUF���i�h�56��]�����w[����&��!��*�R�W��L�(��1�<�l�i�*'�O��,�@�#���h��X%��M�<���N�����"�����u���k�Þ�m���o�uY}^vm��1�����C�d�q�U&��p�Q�~�_�e���
j�TƐ��3��Øa��D�Y��a\�5u5�'�}o����4/t*�cS�b8�h��M���KC3p��D�3-q,I�z�23Pp��z��J}���:k�1�8(%C�	#ǙU���C]�h���������۔������!�U<n��iY�O���f�U�}dY��	v��      �   �
  x��Xiw�8���
wu��Ju o�O!kL`zz�l�x��̙�>�6�T%�:sP�XX����'�,�� P,��ec�8�m��fy�q�z�Q�9�3�|^[]Ϳ�O��5e�^���r�VA�Z��䥍��<�O�I�uP�~5�UJ-F��uB��Am��%1vID�>xo��V'4��oǟ��c�D�e��`�o_3U!��['��/���7=��n{Ġ�m�~���o,@Y���r/Q��.$���o�������]�?�~����d��p��1U��6����wb�����a?5���џ���{�#���ɁL����!��'���?����tG|#�*��c��
+*RdAPx^�+4C��v�C'W	���ᇊ�z^Vt��_	"�r|�V`xsc陮eJ�����O��O�p'��v���ݤ?�L��/�Ω>����m�'@� Zr=��g�����r)%�h�Q.;�>�N�d�3����ՀԦ�𡻹��wnu)�B~��2JŶ�c����9'�C�s�?LX�j�벷��}cy��u8�S�8��Ma)�$KH�e,�������7�[����ڎ/�bJ�d�H�`n���[|���[3�^�6�QH�+ ��F0H����Ab��K_��$��p�� Q☎��=�Yf%A��AB� XV¸¢��x��T4�ˊ�]����x�;6�ٺ�����8��9�O-E���f-u\��-����[VW�;�/ܠ�M��E��U7��G�FϞ��.Kr�ۛ��Pۓ�q�w��u�r^��wo,�z���x���p!���d�H���5�
Fz3{�r?�3�]<r��~J�@D�E�� �'<��Ba
 %�� sX�GF�l�C�C�g)�(M��.���i����T�Ʈ'|�PuM?x�qZ@ñ�c�h�����"u�
��|�+�H5���:��
�,�X��h�������p�7귍k��2�w��Տ��;��(�
C���~#��8�{ޮ{���LV]gўO�¦jT���n$t�}���<U=i=�k��ݮ	Uo\З.ѓ(�=>f�k��h�z�'"ð#���'$č[���j�:^:YEf�$��"9?�m���,s�;~�n?�t6�'D�鎯W���f�5 zDK�V��+���NB�i5)nl`I)�$"!g/s����O7B��o�$�x���IPj�Ԑy�4�s(68��%�X� ����>�+J��#ITJ:G���$<��l�1(.$��м.v|�g��blQB�&N��X҄�H��y�8����a�9�,#Bx�`�6*��!��^`���,���V��_��j���|���$��~��-�Z��1"� �����~��U�W� ���޽�鍮T#t��_:�֜D፰�����R�,Ҝ��g5�ڣZ�c@���?������ӰܱqI���o8�Fb(6<B�8d^��{�N��#�@=�)B�PO�D��c���r�S;�"�8��7 �)��r�|��:��a��~aE�>�+$"�
S��SE�m�7��z��!���\m����Jx���%�Pc��E\^�����NG���|*�L�V�Ed(�.%݅�h�N�<��q���(�k��=�'���ya�e�h���4��#+�t���T.,t`�ǿ������W�����G�ٛ<G��Ai��v�u\;���\5X�o�m�m���6�b��HT�ȇ��4#�O�|�v}7׌=o�7�l��֛7�_���5�~ĸ��p�J�Y��R߷��&kw�U�J�;��ӏ�����W�q�m&3��F<�)uD��0��r�$��7MN`b�̌��
�/+�3������^��w�s�(�s����zҝ���TF�0@((� �� �}u_�1�U«8#� ��[��2��������z�-������3�����`�@��������"*	��(+"Rv^\*��a��9p�%%�K�_ɇ����ͅ�]vZDLR�R8!+���ʦW�T���N���6���!�~$�3��@z(��K���?�p��a�y�|^y	���	�%�h�]��붪�f7�	��U��m�d�_�cEL��� VE��![�R�0�(➻�Q��9_^:v�/�1 �-8�8"*���	��sr�!b�~1GsO¹=qs���{-K�+y���]�!%�L��)��
ȕ�������kŊ1�n�Jw����Ϻ�f*���v4���؅���d���멶xgT J��H)��:G�4�<v��^-r��s;��3!? =�ME���}�h�e�3Z%� ��(���.Bq��V���P1���B��_8>X�a���7N�����:���_�SN�v�
�����G��:���/ѩ�^���}�!������'�RTv����s
nkb�~-���0Q��E��ㆃ�S����q��6�GxӖY���3r��Hn����I+A��1���$2]�ƿ��/�i�C�Z�~�{s����'�s#��8�8�]��b����-�D�+)h��Cح�e��X>$¾�^9�>g�s��Yge�sH��Y
��4�פ9N��- ��:I,##�UDʋ�1�2b`l�[1I_��kw��f��M�n��n������:�u-_FF/�m���օ���n��J���&уh_u�>\�~�qK{&(P����>�	�g߄ �c��:�1�#��#�|���qp��.��Ï�K
�j�F�-o|������ٞ�L��)^��I�(xIbN~���������      �   �  x���=o�0�9�'1���|xm�.T�����H��|P���DIh���J,�����Q�$_��޲LM	+�1��I����mr2�@n>�hW��8�s���0q"�K9pҜ��3��2SV��f�1U�5��QV��@ҞT��19���S��O\�����G�}9`�U�┥�_�����c@���qae�<j��Ϫ��S;*(x=�Imz�N���,��ٴ)�<y�+&}N@�D�b�|�ve�̇�r��7�Taa�8R����ƴJ�bHNw1�wV�C1��|c��<�����f�R�d('�5y�r�]#6j���ܽͰ�V�0p��]�1�,�W)�lqǣ6j���̎����^���3}6�-,�@ǌ��@u����8BO��AF���\c��ܮ�q,��΅���1��:�           x����N�0���S�K�SZ(7`W�d�!^�4K]�XHE�ooQY�k�1�CO��������v1BB�+T+��5�n��X�$U��Oa����5;׺�a��=6�B&2�2T�_�4>3
(��8��|�g��X�1�$�*�3��O|~���wݛ�g�;Ӷ/�v��ݻ�[&����c�C *M��9�N6����L���N���(pYlA��9�������a7�G8
��/G~���/��8�#(��u3�?�GA|��4     