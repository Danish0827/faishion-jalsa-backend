--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

-- Started on 2023-11-09 18:07:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16398)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 252 (class 1259 OID 16637)
-- Name: admintags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admintags (
    tag_id integer NOT NULL,
    tag_name character varying,
    category_id integer,
    subcategory_id integer,
    tag_values character varying[]
);


ALTER TABLE public.admintags OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16654)
-- Name: admintags_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admintags_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admintags_tag_id_seq OWNER TO postgres;

--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 253
-- Name: admintags_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admintags_tag_id_seq OWNED BY public.admintags.tag_id;


--
-- TOC entry 216 (class 1259 OID 16408)
-- Name: attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attributes (
    attribute_id integer NOT NULL,
    vendor_id integer,
    attribute_name character varying(255) NOT NULL,
    attribute_values text[]
);


ALTER TABLE public.attributes OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16413)
-- Name: attributes_attribute_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attributes_attribute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attributes_attribute_id_seq OWNER TO postgres;

--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 217
-- Name: attributes_attribute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attributes_attribute_id_seq OWNED BY public.attributes.attribute_id;


--
-- TOC entry 218 (class 1259 OID 16414)
-- Name: audioheadphones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audioheadphones (
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


ALTER TABLE public.audioheadphones OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16424)
-- Name: audio_headphones_product_ah_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audio_headphones_product_ah_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audio_headphones_product_ah_id_seq OWNER TO postgres;

--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 219
-- Name: audio_headphones_product_ah_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audio_headphones_product_ah_id_seq OWNED BY public.audioheadphones.product_ah_id;


--
-- TOC entry 220 (class 1259 OID 16425)
-- Name: cameraphotography; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cameraphotography (
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


ALTER TABLE public.cameraphotography OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16435)
-- Name: camera_photography_product_cp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.camera_photography_product_cp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.camera_photography_product_cp_id_seq OWNER TO postgres;

--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 221
-- Name: camera_photography_product_cp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.camera_photography_product_cp_id_seq OWNED BY public.cameraphotography.product_cp_id;


--
-- TOC entry 263 (class 1259 OID 16735)
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_cart_id_seq OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 16719)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
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


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16436)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
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


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16444)
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- TOC entry 259 (class 1259 OID 16698)
-- Name: contactus_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contactus_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contactus_contact_id_seq OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 16691)
-- Name: contactus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contactus (
    contact_id integer DEFAULT nextval('public.contactus_contact_id_seq'::regclass) NOT NULL,
    name character varying,
    email character varying,
    subject character varying,
    message character varying,
    "timestamp" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contactus OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 16904)
-- Name: currency_rates_rate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.currency_rates_rate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currency_rates_rate_id_seq OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 16896)
-- Name: currency_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_rates (
    rate_id integer DEFAULT nextval('public.currency_rates_rate_id_seq'::regclass) NOT NULL,
    from_currency character varying,
    to_currency character varying,
    exchange_rate numeric,
    markup_percentage numeric DEFAULT 0,
    effective_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public.currency_rates OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16445)
-- Name: customer_follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_follows (
    follow_id integer NOT NULL,
    follower_id integer NOT NULL,
    following_id integer NOT NULL,
    follow_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customer_follows OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16449)
-- Name: customer_follows_follow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_follows_follow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_follows_follow_id_seq OWNER TO postgres;

--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 225
-- Name: customer_follows_follow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_follows_follow_id_seq OWNED BY public.customer_follows.follow_id;


--
-- TOC entry 261 (class 1259 OID 16717)
-- Name: customer_wishlist_wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_wishlist_wishlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_wishlist_wishlist_id_seq OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 16701)
-- Name: customer_wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_wishlist (
    wishlist_id integer DEFAULT nextval('public.customer_wishlist_wishlist_id_seq'::regclass) NOT NULL,
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    added_date timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.customer_wishlist OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16450)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
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


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16458)
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_customer_id_seq OWNER TO postgres;

--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 227
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- TOC entry 228 (class 1259 OID 16459)
-- Name: laptopcomputers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.laptopcomputers (
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


ALTER TABLE public.laptopcomputers OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16469)
-- Name: laptopcomputers_product_lc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.laptopcomputers_product_lc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.laptopcomputers_product_lc_id_seq OWNER TO postgres;

--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 229
-- Name: laptopcomputers_product_lc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.laptopcomputers_product_lc_id_seq OWNED BY public.laptopcomputers.product_lc_id;


--
-- TOC entry 230 (class 1259 OID 16470)
-- Name: mobileelectronics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mobileelectronics (
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


ALTER TABLE public.mobileelectronics OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 16791)
-- Name: orderitems_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderitems_order_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderitems_order_item_id_seq OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 16769)
-- Name: orderitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderitems (
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


ALTER TABLE public.orderitems OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 16744)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    customer_id integer,
    order_date timestamp with time zone,
    total_amount numeric,
    currency character varying,
    order_status character varying,
    order_updated_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 16819)
-- Name: orderstatushistory_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderstatushistory_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderstatushistory_status_id_seq OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 16807)
-- Name: orderstatushistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderstatushistory (
    status_id integer DEFAULT nextval('public.orderstatushistory_status_id_seq'::regclass) NOT NULL,
    order_id bigint,
    order_status character varying,
    status_date timestamp with time zone
);


ALTER TABLE public.orderstatushistory OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16482)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
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


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16487)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 232
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 268 (class 1259 OID 16805)
-- Name: paymenttransactions_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paymenttransactions_payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paymenttransactions_payment_id_seq OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 16793)
-- Name: paymenttransactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paymenttransactions (
    payment_id integer DEFAULT nextval('public.paymenttransactions_payment_id_seq'::regclass) NOT NULL,
    transaction_id character varying,
    order_id bigint,
    payment_date timestamp with time zone,
    amount numeric,
    currency character varying,
    payment_method character varying
);


ALTER TABLE public.paymenttransactions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16488)
-- Name: product_mobile_electronics_product_me_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_mobile_electronics_product_me_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_mobile_electronics_product_me_id_seq OWNER TO postgres;

--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 233
-- Name: product_mobile_electronics_product_me_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_mobile_electronics_product_me_id_seq OWNED BY public.mobileelectronics.product_me_id;


--
-- TOC entry 272 (class 1259 OID 16840)
-- Name: productreviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productreviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productreviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 16822)
-- Name: productreviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productreviews (
    review_id integer DEFAULT nextval('public.productreviews_review_id_seq'::regclass) NOT NULL,
    product_id integer,
    customer_id integer,
    rating numeric,
    title character varying,
    content character varying,
    review_date timestamp with time zone DEFAULT now(),
    review_media jsonb
);


ALTER TABLE public.productreviews OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16489)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
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


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16499)
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 235
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- TOC entry 236 (class 1259 OID 16500)
-- Name: social_logins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_logins (
    login_id integer NOT NULL,
    customer_id integer NOT NULL,
    provider character varying(50) NOT NULL,
    provider_user_id character varying(255) NOT NULL
);


ALTER TABLE public.social_logins OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16503)
-- Name: social_logins_login_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_logins_login_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_logins_login_id_seq OWNER TO postgres;

--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 237
-- Name: social_logins_login_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_logins_login_id_seq OWNED BY public.social_logins.login_id;


--
-- TOC entry 238 (class 1259 OID 16504)
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategories (
    subcategory_id integer NOT NULL,
    subcategory_name character varying(255) NOT NULL,
    subcategory_description text,
    subcategory_image_url character varying(255),
    parent_category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    subcategory_meta_title character varying
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16511)
-- Name: subcategories_subcategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategories_subcategory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subcategories_subcategory_id_seq OWNER TO postgres;

--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 239
-- Name: subcategories_subcategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcategories_subcategory_id_seq OWNED BY public.subcategories.subcategory_id;


--
-- TOC entry 240 (class 1259 OID 16512)
-- Name: superadmin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.superadmin (
    id integer NOT NULL,
    email character varying(255),
    password character varying(255),
    "userId" character varying(255),
    role_id integer[],
    "position" character varying(255),
    name character varying(255)
);


ALTER TABLE public.superadmin OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16517)
-- Name: superadmin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.superadmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.superadmin_id_seq OWNER TO postgres;

--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 241
-- Name: superadmin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.superadmin_id_seq OWNED BY public.superadmin.id;


--
-- TOC entry 255 (class 1259 OID 16664)
-- Name: support_ticket_ticket_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.support_ticket_ticket_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_ticket_ticket_id_seq OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 16656)
-- Name: support_ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_ticket (
    ticket_id integer DEFAULT nextval('public.support_ticket_ticket_id_seq'::regclass) NOT NULL,
    subject character varying,
    status character varying,
    "timestamp" timestamp with time zone DEFAULT now(),
    customer_id integer
);


ALTER TABLE public.support_ticket OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16688)
-- Name: support_ticket_messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.support_ticket_messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_ticket_messages_message_id_seq OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 16671)
-- Name: support_ticket_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_ticket_messages (
    message_id integer DEFAULT nextval('public.support_ticket_messages_message_id_seq'::regclass) NOT NULL,
    ticket_id integer,
    customer_id integer,
    message character varying,
    "timestamp" timestamp with time zone DEFAULT now(),
    attachments jsonb
);


ALTER TABLE public.support_ticket_messages OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16518)
-- Name: variantproducts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variantproducts (
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


ALTER TABLE public.variantproducts OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16523)
-- Name: variantproducts_variant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variantproducts_variant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variantproducts_variant_id_seq OWNER TO postgres;

--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 243
-- Name: variantproducts_variant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variantproducts_variant_id_seq OWNED BY public.variantproducts.variant_id;


--
-- TOC entry 244 (class 1259 OID 16524)
-- Name: vendorproductorder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendorproductorder (
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


ALTER TABLE public.vendorproductorder OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16531)
-- Name: vendorproductorder_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendorproductorder_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendorproductorder_order_id_seq OWNER TO postgres;

--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 245
-- Name: vendorproductorder_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendorproductorder_order_id_seq OWNED BY public.vendorproductorder.order_id;


--
-- TOC entry 246 (class 1259 OID 16532)
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
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


ALTER TABLE public.vendors OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16538)
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO postgres;

--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 247
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- TOC entry 248 (class 1259 OID 16539)
-- Name: vendors_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors_notifications (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    type character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    date text NOT NULL
);


ALTER TABLE public.vendors_notifications OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16544)
-- Name: vendors_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 249
-- Name: vendors_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_notifications_id_seq OWNED BY public.vendors_notifications.id;


--
-- TOC entry 250 (class 1259 OID 16545)
-- Name: withdrawals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.withdrawals (
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


ALTER TABLE public.withdrawals OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16550)
-- Name: withdrawals_withdrawal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.withdrawals_withdrawal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.withdrawals_withdrawal_id_seq OWNER TO postgres;

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 251
-- Name: withdrawals_withdrawal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.withdrawals_withdrawal_id_seq OWNED BY public.withdrawals.withdrawal_id;


--
-- TOC entry 4836 (class 2604 OID 16655)
-- Name: admintags tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admintags ALTER COLUMN tag_id SET DEFAULT nextval('public.admintags_tag_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 16551)
-- Name: attributes attribute_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes ALTER COLUMN attribute_id SET DEFAULT nextval('public.attributes_attribute_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 16552)
-- Name: audioheadphones product_ah_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audioheadphones ALTER COLUMN product_ah_id SET DEFAULT nextval('public.audio_headphones_product_ah_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 16553)
-- Name: cameraphotography product_cp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cameraphotography ALTER COLUMN product_cp_id SET DEFAULT nextval('public.camera_photography_product_cp_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16554)
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 16555)
-- Name: customer_follows follow_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_follows ALTER COLUMN follow_id SET DEFAULT nextval('public.customer_follows_follow_id_seq'::regclass);


--
-- TOC entry 4798 (class 2604 OID 16556)
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- TOC entry 4802 (class 2604 OID 16557)
-- Name: laptopcomputers product_lc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laptopcomputers ALTER COLUMN product_lc_id SET DEFAULT nextval('public.laptopcomputers_product_lc_id_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 16558)
-- Name: mobileelectronics product_me_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mobileelectronics ALTER COLUMN product_me_id SET DEFAULT nextval('public.product_mobile_electronics_product_me_id_seq'::regclass);


--
-- TOC entry 4816 (class 2604 OID 16559)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 16560)
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 16561)
-- Name: social_logins login_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_logins ALTER COLUMN login_id SET DEFAULT nextval('public.social_logins_login_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 16562)
-- Name: subcategories subcategory_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories ALTER COLUMN subcategory_id SET DEFAULT nextval('public.subcategories_subcategory_id_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 16563)
-- Name: superadmin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superadmin ALTER COLUMN id SET DEFAULT nextval('public.superadmin_id_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 16564)
-- Name: variantproducts variant_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantproducts ALTER COLUMN variant_id SET DEFAULT nextval('public.variantproducts_variant_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 16565)
-- Name: vendorproductorder order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendorproductorder ALTER COLUMN order_id SET DEFAULT nextval('public.vendorproductorder_order_id_seq'::regclass);


--
-- TOC entry 4830 (class 2604 OID 16566)
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- TOC entry 4832 (class 2604 OID 16567)
-- Name: vendors_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors_notifications ALTER COLUMN id SET DEFAULT nextval('public.vendors_notifications_id_seq'::regclass);


--
-- TOC entry 4833 (class 2604 OID 16568)
-- Name: withdrawals withdrawal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdrawals ALTER COLUMN withdrawal_id SET DEFAULT nextval('public.withdrawals_withdrawal_id_seq'::regclass);


--
-- TOC entry 5123 (class 0 OID 16637)
-- Dependencies: 252
-- Data for Name: admintags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admintags (tag_id, tag_name, category_id, subcategory_id, tag_values) FROM stdin;
25	Material	36	62	{Wood,Metal,Plastic}
22	Fabric	16	38	{Cotton,Polyster,Crepe,Chiffon,Lace,Silk}
23	Look	16	38	{Designer,Traditional,Fashion,Contemporary}
24	Occasion	16	38	{Wedding,Casual,Reception,Cocktail,Mehendi}
\.


--
-- TOC entry 5087 (class 0 OID 16408)
-- Dependencies: 216
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attributes (attribute_id, vendor_id, attribute_name, attribute_values) FROM stdin;
6	27	Size	{XL,M,S}
7	27	Pieces	{4pcs,10pcs}
12	36	padding	{10px}
10	36	width	{100px,50px}
9	36	height	{15px,20px}
15	36	dfh	{hkjk,hkkjk}
11	36	margin	{ghfg,fgfddg}
8	36	color	{yfghgfh,ghfgh}
16	36	style	{ghfgh,hfghfgh,ghfgh}
17	36	ghgfh	{9okjljkl}
\.


--
-- TOC entry 5089 (class 0 OID 16414)
-- Dependencies: 218
-- Data for Name: audioheadphones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audioheadphones (product_ah_id, ad_title, description, images, price, currency_symbol, city, state, country, brand, category, vendorid, is_featured, is_sold, is_negotiable, created_at, rejection_reason, status, updated_at_product, uniquepid, category_type, subcategory, condition) FROM stdin;
4	Bose Headphones	i have used it for maximum 2 days	{}	200	USD	Mumbai	Maharashtra	India	Bose	Electronics	27	f	f	f	2023-09-13 12:09:42.591807	\N	0	\N	91518	Products	Audio & Headphones 	Refurbished
6	JBL Headphones	Best 	{1696595079152-doctor-profile.jpg}	1000	USD	Mumbai	Maharashtra	India	JBL	Electronics	36	f	f	f	2023-10-06 14:55:57.098659	Please provide a reason for rejecting the product (Min 25 characters):\n\n	2	2023-10-09 11:39:04.317349	931235	Products	Audio & Headphones 	New
5	JBL Headphones	Best 	{1696588600518-logom.png,1696832374688-doctor-profile.jpg}	100	USD	Mumbai	Maharashtra	India	JBL	Electronics	36	f	f	f	2023-10-06 14:55:52.224835	\N	1	2023-10-06 17:10:22.397571	676735	\N	Audio & Headphones 	New
7	ROG	kjk	{1698045664319-doct_aman.jpg}	100	USD	Mumbai	Maharashtra	India	Sony	Electronics	36	f	f	f	2023-10-16 17:31:00.188567	\N	0	\N	156166	Services	Audio & Headphones 	Used
\.


--
-- TOC entry 5091 (class 0 OID 16425)
-- Dependencies: 220
-- Data for Name: cameraphotography; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cameraphotography (product_cp_id, ad_title, description, images, price, currency_symbol, city, state, country, brand, category, vendorid, is_featured, is_sold, is_negotiable, created_at, subcategory, rejection_reason, status, updated_at_product, uniquepid, category_type, condition) FROM stdin;
21	asdas	asdas	{}	11.98	KES				Nikon	Electronics	28	f	f	f	2023-08-17 13:59:53.52635	Camera & Photography	Hey Bro, Images are not so cool, text should be aligned with the uploaded tiitle	1	2023-09-09 15:06:59.701515	\N	\N	\N
22	asdas	asdasdasd	{1693379151793-Diet.gif}	12	KES	Mumbai	Maharashtra	India	Sony	Electronics	27	f	f	f	2023-08-30 12:35:28.749466	Camera & Photography	hey this side shadab, i want to update the pahe	2	2023-09-09 16:05:55.693877	403512	\N	\N
26	Sony 1	hey	{1694250509624-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcfzktpyqbc.webp,1694250509625-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcycby9yjcj.webp,1694250509625-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcydan9tzue.webp,1694250509625-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcykxtbeqbd.webp,1694250509625-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcymhgjaghf.webp,1694250509625-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcyntsx8wws.webp,1694250509625-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcynwpb25vz.webp,1694250509626-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcyyemh9hbg.webp,1694250583839-Coffee.svg}	1221223	USD	Mumbai	Maharashtra	India	Sony	Electronics	27	f	f	f	2023-09-09 14:37:44.121922	Camera & Photography	\N	0	\N	939246	Products	\N
20	asdas	asdas	{1692264660634-notebook-xps-15-9530-t-black-gallery-5.avif,1692265661503-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcycby9yjcj.webp,1692265661504-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcydan9tzue.webp,1692265661505-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcykxtbeqbd.webp,1692265661505-apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcymhgjaghf.webp}	11.98	KES	Mumbai	Maharashtra	India	Nikon	Electronics	28	f	f	f	2023-08-17 13:59:47.071648	Camera & Photography	Images are not relevant, 	2	2023-10-06 17:04:38.55817	\N	\N	\N
\.


--
-- TOC entry 5133 (class 0 OID 16719)
-- Dependencies: 262
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (cart_id, customer_id, product_id, quantity, created_at, updated_at, product_color, product_size, add_ons) FROM stdin;
14	66	56	1	2023-11-02 10:51:57.043+05:30	2023-11-02 10:51:57.043+05:30	#ff2816	XS	[]
7	66	56	2	2023-11-01 17:54:54.641+05:30	2023-11-01 18:25:34.891+05:30	#617289	XL	["stitched", "unstitched"]
9	66	51	2	2023-11-01 18:00:22.454+05:30	2023-11-01 18:25:34.891+05:30	#617289	XL	["stitched", "unstitched"]
11	66	55	2	2023-11-01 18:21:46.242+05:30	2023-11-01 18:25:34.891+05:30	#617289	XL	["stitched", "unstitched"]
5	62	60	4	2023-11-01 14:25:50.242+05:30	2023-11-01 18:25:01.249+05:30	#ff2816	XS	[]
10	63	56	2	2023-11-01 18:00:41.778+05:30	2023-11-01 18:25:34.891+05:30	#ff2816	XL	["stitched", "unstitched"]
12	64	60	2	2023-11-01 18:23:25.558+05:30	2023-11-01 18:25:34.891+05:30	#ff2816	XS	["stitched", "unstitched"]
15	62	64	3	2023-11-02 15:12:21.92+05:30	2023-11-02 15:12:24.804+05:30	#ff2816	XXL	["stitched"]
\.


--
-- TOC entry 5093 (class 0 OID 16436)
-- Dependencies: 222
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, category_name, category_description, category_image_url, category_status, created_at, updated_at, category_type, category_meta_title) FROM stdin;
18	Legal Services	 	 	t	2023-09-13 12:52:46.378857	2023-09-13 12:52:46.378857	Services	\N
16	Fashion & Accessories	 	https://www.svgrepo.com/show/520749/girl-dress.svg	t	2023-09-01 11:04:35.277032	2023-09-01 11:04:35.277032	Products	\N
12	Electronics	hey this is some text about description\n	https://www.svgrepo.com/show/447989/electronics.svg	t	2023-07-27 10:26:21.153974	2023-07-27 10:26:21.153974	Products	\N
35	Jewelery and Accessories	 	 	t	2023-09-13 15:04:31.390314	2023-09-13 15:04:31.390314	Products	\N
36	Home & Garden	 	 	t	2023-09-13 15:04:43.165985	2023-09-13 15:04:43.165985	Products	\N
37	Health & Beauty	 	 	t	2023-09-13 15:04:57.867048	2023-09-13 15:04:57.867048	Products	\N
38	Toys & Games	 	 	t	2023-09-13 15:05:13.289432	2023-09-13 15:05:13.289432	Products	\N
39	Sports & Outdoors	 	  	t	2023-09-13 15:05:27.274228	2023-09-13 15:05:27.274228	Products	\N
40	Books & Stationery	 	 	t	2023-09-13 15:05:39.240316	2023-09-13 15:05:39.240316	Products	\N
41	Food & Beverages	 	 	t	2023-09-13 15:05:51.731831	2023-09-13 15:05:51.731831	Products	\N
42	Men's Clothing	 	 	t	2023-09-13 15:06:03.205105	2023-09-13 15:06:03.205105	Products	\N
43	Automotive	 	 	t	2023-09-13 15:06:16.960257	2023-09-13 15:06:16.960257	Products	\N
44	Baby & Kids	 	 	t	2023-09-13 15:06:29.708447	2023-09-13 15:06:29.708447	Products	\N
45	Office & School Supplies	 	 	t	2023-09-13 15:06:42.007408	2023-09-13 15:06:42.007408	Products	\N
46	Art & Collectibles	 	 	t	2023-09-13 15:06:55.764144	2023-09-13 15:06:55.764144	Products	\N
15	Women's Clothing	 	 https://www.svgrepo.com/show/157325/women-clothing.svg	t	2023-08-01 17:33:19.50883	2023-08-01 17:33:19.50883	Products	\N
49	Home Appliances	 	 	t	2023-09-13 15:07:30.138273	2023-09-13 15:07:30.138273	Products	\N
50	Music & Instruments	  	 	t	2023-09-13 15:07:42.963031	2023-09-13 15:07:42.963031	Products	\N
51	Freelance Services	 	 	t	2023-09-13 15:08:06.895302	2023-09-13 15:08:06.895302	Services	\N
52	Real Estate	 	 	t	2023-09-13 15:08:18.805658	2023-09-13 15:08:18.805658	Services	\N
53	Event Services	 	 	t	2023-09-13 15:08:30.026139	2023-09-13 15:08:30.026139	Services	\N
54	Electronics Repair	 	 	t	2023-09-13 15:08:44.112208	2023-09-13 15:08:44.112208	Services	\N
55	Jobs & Services	 	 	t	2023-09-13 15:08:53.874458	2023-09-13 15:08:53.874458	Services	\N
56	Health and Fitness Services	 	 	t	2023-09-13 15:09:04.316822	2023-09-13 15:09:04.316822	Services	\N
57	Business Services	 	 	t	2023-09-13 15:09:15.325596	2023-09-13 15:09:15.325596	Services	\N
58	Food Delivery Services	 	 	t	2023-09-13 15:09:26.116065	2023-09-13 15:09:26.116065	Services	\N
59	Education & Learning	 	 	t	2023-09-13 15:09:37.99679	2023-09-13 15:09:37.99679	Services	\N
60	Beauty Services	 	 	t	2023-09-13 15:09:49.564318	2023-09-13 15:09:49.564318	Services	\N
61	Travel & Experience	 	 	t	2023-09-13 15:10:02.171066	2023-09-13 15:10:02.171066	Services	\N
62	Handmade & Crafts	 	 	t	2023-09-13 15:10:14.341135	2023-09-13 15:10:14.341135	Services	\N
63	Dating	 	 	t	2023-09-13 15:10:26.476666	2023-09-13 15:10:26.476666	Services	\N
47	Smart Devices	 	 	t	2023-09-13 15:07:07.039591	2023-09-13 15:07:07.039591	Products	\N
48	Electronic Accessories	 	 	t	2023-09-13 15:07:18.966999	2023-09-13 15:07:18.966999	Products	\N
64	Clothings	clothings	https://th.bing.com/th/id/OIP.J6CvdPixWjEIsoEXlAoBaQHaIq?w=159&h=185&c=7&r=0&o=5&pid=1.7	f	2023-10-05 14:39:32.776565	2023-10-05 14:39:32.776565	Products	\N
65	Clothing	clothings	https://th.bing.com/th/id/OIP.J6CvdPixWjEIsoEXlAoBaQHaIq?w=159&h=185&c=7&r=0&o=5&pid=1.7	\N	2023-10-05 14:57:31.972428	2023-10-05 14:57:31.972428	Products	hello
67	Saree	Saree	https://th.bing.com/th/id/OIP.J6CvdPixWjEIsoEXlAoBaQHaIq?w=159&h=185&c=7&r=0&o=5&pid=1.7	t	2023-10-31 17:52:06.80243	2023-10-31 17:52:06.80243	Products	hello
\.


--
-- TOC entry 5129 (class 0 OID 16691)
-- Dependencies: 258
-- Data for Name: contactus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contactus (contact_id, name, email, subject, message, "timestamp") FROM stdin;
1	Aditi	patiladiti240@gmail.com	Contact us api testing	I have created a api for Contact us form submission. Now testing it	2023-10-30 12:15:19.803821+05:30
2	Aditi	patiladiti240@gmail.com	Contact us api testing	I have created a api for Contact us form submission. Now testing it	2023-10-30 12:15:19.803821+05:30
3	Aditi	patiladiti240@gmail.com	Contact us api testing 3	I have created a api for Contact us form submission. Now testing it THRICE	2023-10-30 12:16:06.002304+05:30
4	Aditi Balasaheb Patil	patiladiti240@gmail.com	Contact us api testing 4	I have created a api for Contact us form submission. Now testing it fourth time	2023-10-30 12:16:45.48771+05:30
\.


--
-- TOC entry 5144 (class 0 OID 16896)
-- Dependencies: 273
-- Data for Name: currency_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_rates (rate_id, from_currency, to_currency, exchange_rate, markup_percentage, effective_date) FROM stdin;
1	USD	INR	83.29	0.3	2023-11-09 17:59:29.835264+05:30
2	USD	INR	83.29	0.3	2023-11-09 17:59:46.351272+05:30
3	INR	USD	0.012005588	1	2023-11-09 18:02:42.627821+05:30
\.


--
-- TOC entry 5095 (class 0 OID 16445)
-- Dependencies: 224
-- Data for Name: customer_follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_follows (follow_id, follower_id, following_id, follow_date) FROM stdin;
\.


--
-- TOC entry 5131 (class 0 OID 16701)
-- Dependencies: 260
-- Data for Name: customer_wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_wishlist (wishlist_id, customer_id, product_id, added_date) FROM stdin;
1	65	64	2023-10-31 12:45:15.850898+05:30
2	65	3	2023-10-31 12:56:26.126027+05:30
4	63	55	2023-10-31 12:56:49.677929+05:30
6	63	65	2023-10-31 12:57:03.480573+05:30
7	63	6	2023-10-31 12:57:09.092019+05:30
\.


--
-- TOC entry 5097 (class 0 OID 16450)
-- Dependencies: 226
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (customer_id, given_name, family_name, email, password, phone_number, address_line_1, address_line_2, city, state, zip_code, country, bio, verified_with, created_at, updated_at, status, picture, google_id, facebook_id, verification_code, verification_expire_date, customer_loggedid) FROM stdin;
53	Khan	Shadab	ks615044@gmail.com	$2b$10$q7LbdFZRarTXt0rpjO2ccunBAlaqH04/cgx0zqpQmMOT3zhFud/SO				Mumbai	Maharashtra		India		\N	2023-09-21 18:07:45.571511	2023-09-21 18:07:45.571511	1	\N	\N	\N	7424	2023-09-21 18:37:45.57	7sPjLVxKoo&Cgql^fBAX
63	Shadab Alam	Khan	pwscoding@gmail.com		\N	\N	\N	\N	\N	\N	\N	\N	{Google}	2023-09-28 22:19:43.488032	2023-09-28 22:19:43.488032	1	https://lh3.googleusercontent.com/a/ACg8ocIbk8onoXlXKmGjvPva9T6yZ_uBHvtuiu4dpAZcTxonSw=s96-c	111747526906339832724	\N	\N	\N	\N
64	khan	Shadab	skshadabkhojo@gmail.com	$2b$10$KChrlBf9OiQkwkWpMneFEewUgZwKWs1gN1q/scbRcdcfGYDANU/pa				New Castle	Delaware		United States		\N	2023-09-29 15:46:11.643574	2023-09-29 15:46:11.643574	1	\N	\N	\N	5726	2023-09-29 16:16:11.642	pB*^3@QOiHHcQvZg#F4p
62	Sagar	Tech	sagartech@sagartech.co.in		\N	\N	\N	\N	\N	\N	\N	\N	{Google}	2023-09-23 10:22:36.041924	2023-09-23 10:22:36.041924	1	https://lh3.googleusercontent.com/a/ACg8ocJFJejbcMcP8MKVEl14as6g-MQG3bLU94ZVsrwtmlqq=s96-c	114025575174764942257	\N	\N	\N	\N
66	Aafreen	Sayyed	ms.sayyedaafreen786@gmail.com	$2b$10$JpwyaXiU4QtkyC.a5gM/DujtMNiSX/nOsB52zIfA/AYw.COTjMfUW	06534765876	123	123	mumbai	Maharashtra	400709	India	WP	\N	2023-10-02 16:24:23.923406	2023-10-11 11:09:21.333082	3	Customer-Profile-1697000808174 - doctor-profile.jpg	\N	\N	7924	2023-10-02 16:54:23.923	^*mL0sQaB3AUKbI@t!lE
65	Aditi	Patil	patiladiti240@gmail.com		7678063042	Plot No.131, Sector-28	\N	Mumbai	Maharashtra	400709	India	Full Stack Developer	{Google}	2023-10-02 16:23:01.986791	2023-10-24 10:43:09.252327	3	Customer-Profile-1697003309124 - doct_aman.jpg	110010250790677440704	\N	\N	\N	\N
\.


--
-- TOC entry 5099 (class 0 OID 16459)
-- Dependencies: 228
-- Data for Name: laptopcomputers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.laptopcomputers (product_lc_id, ad_title, images, currency_symbol, city, state, country, brand, category, vendorid, is_featured, is_sold, is_negotiable, created_at, subcategory, rejection_reason, status, updated_at_product, uniquepid, category_type, condition, skuid, mrp, sellingprice, localdeliverycharge, zonaldeliverycharge, nationaldeliverycharge, weightkg, lengthcm, breadthcm, heightcm, countryoforigin, manufacturername, packerdetails, additionaldescription, searchkeywords, salespackage, keyfeatures, videourl, modelname, processor, ram, storagetype, storagecapacity, displaysize, screenresolution, graphicscard, operatingsystem, connectivityports, batterylife, keyboardtype, touchpad, dimensions, weight, warrantyinformation, isvariant, quantity) FROM stdin;
103	hagsdjag	{}	USD	Manassas	Virginia	United States	\N	Electronics	27	f	f	f	2023-10-01 23:22:16.996719	Laptop & Computers	\N	0	\N	728773	Products	\N	jh	111	21	jg	jhgjh	gjhg	jhgj	gjg	jhgj	hg	United States	kjhkj	hkjh	j	hkj	jhk	hk	jhk	kh	kjhkhkj	hkjh	kh	kh	j	hkjh	kjhjkhkjhj	kh	kjhkh	kj	hkj	hkj	h	kjhkjhkj	h	Simple	1
105	kakdhkahk	{"1696184654541-manali banner.jpg"}	USD	Manassas	Virginia	United States	Acer	Electronics	27	f	f	f	2023-10-01 23:53:59.069992	Laptop & Computers	\N	0	\N	647763	Products	New	\N	\N	\N	hkh	kh	khkhsakhdk	hlkh	khklh	kl	hklhkl	hkl	jh	hkjh	hj	khkh	kjh	khkh	kjk	hkjh	kkh	hkh	kj	hkjh	kjh	kjhk	jhkj	hkjh	kj	hkj	kh	kjh	kjkh	khkj	hk	Variant	\N
104	khknlkjkl	{1696184101887-logo.png}	USD	Manassas	Virginia	United States	\N	Electronics	27	f	f	f	2023-10-01 23:43:07.57182	Laptop & Computers	\N	2	2023-10-06 15:05:55.406849	820198	Products	\N	\N	\N	\N	jkl	jlkl	jlk	jkl	klj	klj	klj	kl	l	jlkjlkj	lkj	lkjl	kjlkj	klj	kljlk	klj	klj	kl	kl	kjl	jkljlk	kl	jlk	lk	jlk	jlk	jkl	jlk	lk	lkj	lkj	Variant	\N
\.


--
-- TOC entry 5101 (class 0 OID 16470)
-- Dependencies: 230
-- Data for Name: mobileelectronics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mobileelectronics (product_me_id, ad_title, description, images, created_at, updated_at, price, location, city, state, country, currency_symbol, category, subcategory, condition, brand, year, is_featured, views, is_sold, is_negotiable, vendorid, rejection_reason, status, updated_at_product, uniquepid, category_type, modelname, processor, ram, storagetype, storagecapacity, displaysize, screenresolution, graphicscard, operatingsystem, connectivityports, batterylife, touchpad, dimensions, weight, warrantyinformation) FROM stdin;
326	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1692595337928_2Q==.jpg}	2023-08-21 10:52:17.861+05:30	2023-08-21 10:52:18.008471+05:30	400	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	Image not valid, please add valid images	1	2023-09-09 15:07:02.421919	61633	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
327	Wireless Bluetooth Earbuds	Enjoy high-quality audio and convenience with these wireless Bluetooth earbuds.	{1692595337929_2Q==.jpg}	2023-08-21 10:52:17.895+05:30	2023-08-21 10:52:18.008471+05:30	234	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	\N	1	\N	264933	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
328	Portable Power Bank	Keep your devices charged on the go with this compact and powerful portable power bank.	{1692595337929_9k=.jpg}	2023-08-21 10:52:17.909+05:30	2023-08-21 10:52:18.008471+05:30	342	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	\N	1	\N	887633	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
329	Smart Fitness Tracker	Achieve your fitness goals with this smart fitness tracker that monitors your activities and health.	{1692595337929_Z.jpg}	2023-08-21 10:52:17.916+05:30	2023-08-21 10:52:18.008471+05:30	1342	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	\N	1	\N	314633	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
336	Portable Power Bank	Keep your devices charged on the go with this compact and powerful portable power bank.	{1692617841526_9k=.jpg}	2023-08-21 17:07:21.501+05:30	2023-08-21 17:07:21.538922+05:30	342	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	29	\N	1	\N	989983	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
337	Smart Fitness Tracker	Achieve your fitness goals with this smart fitness tracker that monitors your activities and health.	{1692617841526_Z.jpg}	2023-08-21 17:07:21.513+05:30	2023-08-21 17:07:21.538922+05:30	1342	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	29	\N	1	\N	341683	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
335	Wireless Bluetooth Earbuds	Enjoy high-quality audio and convenience with these wireless Bluetooth earbuds.	{1692617841526_2Q==.jpg}	2023-08-21 17:07:21.487+05:30	2023-08-21 17:07:21.538922+05:30	234	\N	Mumbai	Maharashtra	India	ETB	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	29	\N	1	\N	498183	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
331	Wireless Bluetooth Earbuds	Enjoy high-quality audio and convenience with these wireless Bluetooth earbuds.	{1692595367803_2Q==.jpg}	2023-08-21 10:52:47.794+05:30	2023-08-21 10:52:47.807281+05:30	234	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	\N	1	\N	715436	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
332	Portable Power Bank	Keep your devices charged on the go with this compact and powerful portable power bank.	{1692595367803_9k=.jpg}	2023-08-21 10:52:47.798+05:30	2023-08-21 10:52:47.807281+05:30	342	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	\N	1	\N	645836	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
333	Smart Fitness Tracker	Achieve your fitness goals with this smart fitness tracker that monitors your activities and health.	{1692595367803_Z.jpg}	2023-08-21 10:52:47.8+05:30	2023-08-21 10:52:47.807281+05:30	1342	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	\N	1	\N	373936	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
338	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1692707858936_2Q==.jpg}	2023-08-22 18:07:38.903+05:30	2023-08-22 18:07:39.002135+05:30	400	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	\N	1	\N	235671	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
344	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1694585945531_2Q==.jpg}	2023-09-13 11:49:05.489+05:30	2023-09-13 11:49:05.668738+05:30	400	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	Refurbished	Apple	\N	f	0	f	t	27	\N	0	\N	512892	Products	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
330	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1692595367803_2Q==.jpg}	2023-08-21 10:52:47.78+05:30	2023-08-21 10:52:47.807281+05:30	400	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	28	7iiukkljkhjkukuuiiyiyui8i8	2	2023-10-06 15:59:14.20297	882936	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
346	iphone	tyttyty	{1697872756290-logom.png}	2023-10-06 16:30:03.444918+05:30	2023-10-06 16:30:03.444918+05:30	500	\N	Mumbai	Maharashtra	India	KES	Electronics	Mobile Electronics	Used	Apple	\N	f	0	f	t	36	Please provide a reason for rejecting the product (Min 25 characters)	0	2023-10-06 17:46:49.108571	730900	Products	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
334	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1692617841525_2Q==.jpg}	2023-08-21 17:07:21.459+05:30	2023-08-21 17:07:21.538922+05:30	400	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	29	Audio & Headphjjuyuones efr7tfryewfr763frygeyu	2	2023-10-06 16:02:08.406682	592283	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
340	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1693399746713_2Q==.jpg}	2023-08-30 18:19:06.696+05:30	2023-08-30 18:19:06.716288+05:30	400	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	\N	Apple	\N	f	0	f	t	34	Image is not relevant, please upload again	1	2023-10-06 16:07:48.925402	365574	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
348	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1697890353388_2Q==.jpg}	2023-10-21 17:42:33.295+05:30	2023-10-21 17:42:33.471669+05:30	400	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	Refurbished	Apple	\N	f	0	f	t	36	\N	0	\N	54832	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
349	NEW Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	{1697890512924_2Q==.jpg}	2023-10-21 17:45:12.892+05:30	2023-10-21 17:45:13.020945+05:30	5000	\N	Mumbai	Maharashtra	India	AED	Electronics	Mobile Electronics	New	OnePlus	\N	f	0	f	t	36	\N	0	\N	394248	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
347	hf7sduf	thjj	{1697872787692-logom.png}	2023-10-06 16:31:54.446697+05:30	2023-10-06 16:31:54.446697+05:30	46546	\N	Mumbai	Maharashtra	India	USD	Electronics	Mobile Electronics	New	Google (Pixel)	\N	f	0	f	t	36	\N	0	2023-10-06 16:41:51.412687	231311	Products	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
350	OLD SmartPhone	desc	{1697890512924_2Q==.jpg}	2023-10-21 17:45:12.909+05:30	2023-10-21 17:45:13.020945+05:30	6000	\N	Mumbai	Maharashtra	India	INR	Electronics	Mobile Electronics	Used	Samsung	\N	f	0	f	t	36	Please provide a reason for rejecting the product (Min 25 characters):\n\n	2	2023-10-23 17:14:41.526037	103848	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5136 (class 0 OID 16769)
-- Dependencies: 265
-- Data for Name: orderitems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderitems (order_item_id, order_id, product_id, quantity, price, product_color, product_size, add_ons, currency, order_item_status, cancellation_reason, statusupdate_date) FROM stdin;
1	1699014603823	56	2	\N	#617289	XL	["stitched", "unstitched"]	\N	Pending	\N	\N
2	1699014603823	55	2	\N	#ff2816	XL	["stitched", "unstitched"]	\N	Pending	\N	\N
3	1699014603823	56	1	\N	#ff2816	XS	[]	\N	Pending	\N	\N
6	1699014603823	63	2	100	#617289	XL	["stitched", "unstitched"]	USD	Pending	\N	2023-11-07 16:26:13.220167+05:30
5	1699093583907	56	2	100	#617289	XL	["stitched", "unstitched"]	USD	Pending	\N	\N
8	1699440742100	63	2	100	#617289	XL	["stitched", "unstitched"]	USD	Confirmed	\N	2023-11-08 16:22:59.498526+05:30
7	1699093583907	63	2	100	#617289	XL	["stitched", "unstitched"]	USD	Cancelled	ok cancelled	2023-11-07 16:39:44.67696+05:30
9	1699530786351	63	2	100	#617289	XL	["stitched", "unstitched"]	USD	Pending	\N	2023-11-09 17:23:38.091418+05:30
10	1699530786351	63	2	100	#617289	XS	["stitched", "unstitched"]	USD	Pending	\N	2023-11-09 17:23:47.10385+05:30
\.


--
-- TOC entry 5135 (class 0 OID 16744)
-- Dependencies: 264
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, customer_id, order_date, total_amount, currency, order_status, order_updated_date) FROM stdin;
1699014603823	66	2023-11-03 18:00:03.823+05:30	26115	INR	Confirmed	2023-11-09 11:54:34.083+05:30
1699093583907	66	2023-11-04 15:56:23.907+05:30	1000	INR	Confirmed	2023-11-09 11:54:40.38+05:30
1699440742100	63	2023-11-08 16:22:22.1+05:30	1000	INR	Confirmed	2023-11-09 11:54:46.414+05:30
1699530771527	63	2023-11-09 17:22:51.527+05:30	1000	INR	Pending	2023-11-09 17:22:51.581345+05:30
1699530786351	66	2023-10-09 17:23:06.352+05:30	1000	INR	Pending	2023-11-09 17:23:06.400664+05:30
\.


--
-- TOC entry 5140 (class 0 OID 16807)
-- Dependencies: 269
-- Data for Name: orderstatushistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderstatushistory (status_id, order_id, order_status, status_date) FROM stdin;
1	1699014603823	Pending	2023-11-03 00:00:00+05:30
2	1699014603823	Confirmed	2023-11-04 15:41:18.454+05:30
3	1699014603823	Ready to ship	2023-11-04 15:42:56.227+05:30
4	1699014603823	Delivered	2023-11-04 15:42:56.227+05:30
5	1699014603823	Delivered	2023-11-04 15:42:56.227+05:30
6	1699014603823	Delivered	2023-11-03 15:42:56.227+05:30
7	1699014603823	Delivered	2023-11-03 15:42:56.227+05:30
8	1699014603823	Delivered	2023-11-04 15:55:14.31+05:30
9	1699093583907	Pending	2023-11-04 15:56:23.953+05:30
10	1699093583907	Confirmed	2023-11-04 16:00:09.497+05:30
11	1699014603823	Confirmed	2023-11-04 15:58:20.282+05:30
12	1699014603823	Exchanged	2023-11-06 15:38:58.539+05:30
13	1699014603823	Confirmed	2023-11-06 15:39:02.808+05:30
14	1699093583907	Confirmed	2023-11-06 15:31:14.205+05:30
15	1699440742100	Pending	2023-11-08 16:22:22.208+05:30
16	1699014603823	Pending	2023-11-06 15:41:01.202+05:30
17	1699093583907	Pending	2023-11-08 15:07:19.376+05:30
18	1699440742100	Confirmed	2023-11-08 16:31:13.745+05:30
\.


--
-- TOC entry 5102 (class 0 OID 16482)
-- Dependencies: 231
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, customer_id, order_id, payment_date, payment_method, payment_amount, payment_status, billing_address, billing_city, billing_state, billing_zip, currency_code, payment_source, vendor_id) FROM stdin;
2	2	102	2023-09-02 10:15:00	PayPal	75.25	Paid	456 Elm St	Los Angeles	CA	90001	USD	Customer	27
3	3	103	2023-09-03 16:45:00	Credit Card	125.75	Paid	789 Oak St	Chicago	IL	60001	USD	Company	27
5	5	105	2023-09-05 09:30:00	Credit Card	95.90	Paid	222 Maple St	Houston	TX	77001	USD	Customer	27
1	1	101	2023-09-01 14:30:00	Credit Card	100.50	Paid	123 Main St	New York	NY	10001	USD	Customer	27
4	4	104	2023-09-04 12:00:00	Bank Transfer	50.00	Pending	101 Pine St	San Francisco	CA	94101	USD	Customer	27
\.


--
-- TOC entry 5138 (class 0 OID 16793)
-- Dependencies: 267
-- Data for Name: paymenttransactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paymenttransactions (payment_id, transaction_id, order_id, payment_date, amount, currency, payment_method) FROM stdin;
1	ABC123	1699014603823	2023-11-04 13:04:25.206+05:30	1000	INR	Credit Card
2	Auudf7re123	1699014603823	2023-11-04 00:00:00+05:30	1000	INR	Credit Card
3	FSDFET	1699014603823	2023-11-01 00:00:00+05:30	1000	INR	Credit Card
\.


--
-- TOC entry 5142 (class 0 OID 16822)
-- Dependencies: 271
-- Data for Name: productreviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productreviews (review_id, product_id, customer_id, rating, title, content, review_date, review_media) FROM stdin;
1	56	66	3	Title 1	I am testing the review	\N	["img.jpg", "img.jpg"]
2	56	66	3	Title 1	I am testing the review	2023-11-04 17:13:59.609942+05:30	["img.jpg", "img.jpg"]
3	56	66	4	testing	testing content	2023-11-04 17:34:21.816367+05:30	["uploads\\\\vendorsProductImages\\\\Image-1699099461748 - favicon.png", "uploads\\\\vendorsProductImages\\\\Image-1699099461750 - linux-logo.png"]
4	56	66	4	testing	testing content	2023-11-04 17:34:59.656956+05:30	[]
5	56	66	4	testing	testing content	2023-11-04 17:35:49.200581+05:30	[]
6	56	66	4.2	testing	testing content	2023-11-08 17:06:46.594845+05:30	[]
7	56	66	4.2	testing	testing content	2023-11-08 17:12:57.720615+05:30	[]
\.


--
-- TOC entry 5105 (class 0 OID 16489)
-- Dependencies: 234
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_name, description, price, quantity, brand, product_images, vendor_id, featured, product_tags, product_variants, add_ons, created_at, updated_at, product_type, discount, size_chart, product_status, rejection_reason, category_id, subcategory_id, product_care, currency_symbol, weight, shipping_fee, ratings, review_count, weight_unit) FROM stdin;
54	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	400.00	10	Apple	[{"color": "#617289", "price": 3, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	29	f	\N	\N	[{"price": 80, "title": "unstitched"}, {"price": 100, "title": "stitched"}]	2023-10-23 12:43:38.413025+05:30	2023-10-23 16:55:35.635415+05:30	Variant	15	\N	2	Please provide a reason for rejecting the product (Min 25 characters):\n\n	18	41	\N	USD	250	{"zonal": 1, "regional": 1, "international": 1}	\N	\N	g
3	Yellow Kurta Set	Style no: 100, work: print	1500.00	50	Kalki	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	[{"fabric": ["chiffon", "cotton"]}, {"occasion": ["wedding", "mehendi"]}]	[{"color": ["red", "green"]}, {"size": ["XS", "S", "M", "L", "XL"]}]	[{"price": 999, "title": "unstitched fabric"}, {"price": 999, "title": "ready size stitching"}]	2023-10-13 12:03:29.647407+05:30	2023-10-13 12:03:29.647407+05:30	variant	30	\N	2	\N	16	40	["do not use bleach", "do not tumble dry"]	\N	25	{"zonal": 500, "regional": 200, "international": 1000}	\N	\N	\N
51	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	400.00	10	Apple	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	f	\N	\N	[{"price": 60, "title": "unstitched"}, {"price": 90, "title": "stitched"}]	2023-10-23 12:38:02.993667+05:30	2023-10-23 16:17:40.84299+05:30	Variant	15	\N	2	just reject it for gs plz	18	41	\N	USD	250	{"zonal": 1, "regional": 1, "international": 1}	\N	\N	g
63	gfg	gf	3.00	3	rgdfg	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	["Lace", "Polyster", "Silk", "Traditional", "Chiffon"]	\N	[{"price": 72, "title": "unstitched"}, {"price": 84, "title": "stitched"}]	2023-10-23 15:11:52.35125+05:30	2023-10-24 10:40:43.252775+05:30	variant	3	\N	1	\N	16	38	["ff", "fhfh", "gf"]	USD	3	{"zonal": 3, "regional": 3, "international": 3}	\N	\N	g
55	Premium Smartphone 2	Experience the latest in mobile technology with this feature-packed smartphone.	30000.00	50	OnePlus	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	\N	\N	[{"price": 90, "title": "unstitched"}, {"price": 110, "title": "stitched"}]	2023-10-23 12:43:38.413025+05:30	2023-10-23 17:22:36.11745+05:30	Simple	10	\N	1	\N	18	41	\N	INR	500	{"zonal": 1, "regional": 1, "international": 1}	\N	\N	g
60	Premium Smartphone	Experience the latest in mobile technology with this feature-packed smartphone.	400.00	10	Apple	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	f	\N	\N	[{"price": 50, "title": "unstitched"}, {"price": 150, "title": "stitched"}]	2023-10-23 13:01:21.274883+05:30	2023-10-25 13:16:20.007508+05:30	variant	15	\N	0	\N	35	54	\N	USD	250	{"zonal": 0, "regional": 0, "international": 0}	\N	\N	g
64	PATIL	rty	5.00	5	ADITI	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	\N	\N	[{"price": 99, "title": "unstitched"}, {"price": 299, "title": "stitched"}]	2023-10-25 15:36:27.330282+05:30	2023-10-25 15:38:57.103596+05:30	simple	15	\N	0	\N	38	74	\N	EUR	5	{"zonal": 10, "regional": 10, "international": 10}	\N	\N	g
50	PATIL	SD	2.00	2	ADITI	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	\N	\N	\N	[{"price": 500, "title": "unstitched"}, {"price": 100, "title": "stitched"}]	2023-10-21 15:37:25.198292+05:30	2023-10-23 16:56:13.0615+05:30	simple	2	\N	2	tyytrytrtyegrye eguregru er	16	38	\N	USD	2	{"zonal": 2, "regional": 2, "international": 2}	\N	\N	g
4	Yellow Kurta Set, Yellow	Style no: 100, work: print	1500.00	50	Kalki	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	[{"fabric": ["chiffon", "cotton"]}, {"occasion": ["wedding", "mehendi"]}]	[{"color": ["red", "green"]}, {"size": ["XS", "S", "M", "L", "XL"]}]	[{"price": 999, "title": "unstitched fabric"}, {"price": 999, "title": "ready size stitching"}]	2023-10-13 12:09:06.210165+05:30	2023-10-25 17:11:50.252787+05:30	variant	30	null	0	hgh	35	54	["do not use bleach", "do not tumble dry"]	USD	30	{"zonal": 0, "regional": 0, "international": 0}	\N	\N	g
65	iphone	abc	100.00	1	apple	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	\N	\N	[{"price": 81, "title": "unstitched"}, {"price": 250, "title": "stitched"}]	2023-10-25 17:23:46.724915+05:30	2023-10-25 17:23:46.724915+05:30	simple	10	\N	0	\N	12	37	\N	USD	1	{"zonal": 100, "regional": 200, "international": 300}	\N	\N	g
6	Green Kurta Set	Style no: 100, work: print	5000.00	50	Kalki	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	[{"fabric": ["chiffon", "cotton"]}, {"occasion": ["wedding", "mehendi"]}]	[{"color": ["red", "green"]}, {"size": ["XS", "S", "M", "L", "XL"]}]	[{"price": 999, "title": "unstitched fabric"}, {"price": 999, "title": "ready size stitching"}]	2023-10-13 12:19:43.030535+05:30	2023-10-13 12:19:43.030535+05:30	variant	50	\N	2	hgh	1	1	["do not use bleach", "do not tumble dry"]	\N	100	{"zonal": 500, "regional": 500, "international": 1000}	\N	\N	\N
41	fgdfhhh	yhgfhffhfhfh	4000.00	6	fhdhfhfghfgh	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	null	\N	[{"price": 6, "title": "1"}]	2023-10-21 11:37:45.94683+05:30	2023-10-23 16:46:19.946392+05:30	variant	6	null	2	gfygfygfuygdufygfygfdfdfdfd	35	55	["6"]	USD	6	{"zonal": 10, "regional": 11, "international": 12}	\N	\N	g
42	abc	abc	100.00	1	abc	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	\N	\N	[{"price": 1, "title": "1"}]	2023-10-21 13:35:50.949504+05:30	2023-10-23 16:54:27.022665+05:30	simple	1	\N	2	Please provide a reason for rejecting the product (Min 25 characters):\n\n	36	61	["1"]	KES	1	{"zonal": 1, "regional": 1, "international": 1}	\N	\N	g
43	abc	abc	100.00	1	abc	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	29	t	null	\N	[{"price": 1, "title": "1"}]	2023-10-21 13:35:51.006856+05:30	2023-10-24 10:40:53.938898+05:30	simple	1	null	2	Please provide a reason for rejecting the product (Min 25 characters):\n\n	36	61	["1"]	KES	1	{"zonal": 1, "regional": 1, "international": 1}	\N	\N	g
44	PATIL	yuyu	67.00	6	ADITI	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	null	\N	[{"price": 1, "title": "1"}]	2023-10-21 13:42:25.338505+05:30	2023-10-23 16:57:14.591502+05:30	simple	6	null	2	Please provide a reason for rejecting the product (Min 25 characters):\n\n	35	54	["1"]	USD	6	{"zonal": 6, "regional": 6, "international": 6}	\N	\N	g
45	ffg	yuyu	67.00	6	gg	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	null	\N	[{"price": 1, "title": "1"}]	2023-10-21 13:42:25.354313+05:30	2023-10-23 16:56:35.532091+05:30	simple	6	null	2	Please provide a reason for rejecting the product (Min 25 characters):\n\n	35	54	["1"]	USD	6	{"zonal": 2, "regional": 2, "international": 2}	\N	\N	g
48	ffg	s	2.00	2	gg	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	t	\N	\N	\N	2023-10-21 15:22:06.129898+05:30	2023-10-23 17:03:51.104616+05:30	simple	2	\N	2	You are about to reject the product "ffg". This action can be undone if needed.\n\n	\N	\N	\N	USD	2	{"zonal": 2, "regional": 2, "international": 2}	\N	\N	g
49	ffg	e	2.00	2	gg	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	36	\N	null	\N	[{"price": 2, "title": "2"}]	2023-10-21 15:23:16.5559+05:30	2023-10-23 16:59:22.172678+05:30	simple	2	null	2	Providing a reason for rejection helps maintain transparency and communication with vendors. It also provides valuable feedback and allows vendors to understand the decision better.	\N	\N	["2"]	USD	2	{"zonal": 2, "regional": 2, "international": 2}	\N	\N	g
56	Premium Smartphone 3	Experience the latest in mobile technology with this feature-packed smartphone.	3000.00	20	Samsung	[{"color": "#617289", "price": 5000, "sizes": ["XS", "XL"], "images": ["https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/online-fashion-shopping-with-computer_23-2150400628.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688502.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}, {"color": "#ff2816", "price": 6000, "sizes": ["XS", "XL", "XXL"], "images": ["https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34865.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais", "https://img.freepik.com/free-vector/online-shopping-isometric-icon-internet-purchase-laptop-with-shop-basket-screen-online-payment_39422-973.jpg?size=626&ext=jpg&ga=GA1.1.1672468054.1697542487&semt=ais"]}]	29	f	\N	\N	[{"price": 5000, "title": "unstitched"}, {"price": 10000, "title": "stitched"}]	2023-10-23 12:43:38.413025+05:30	2023-10-23 16:31:15.636104+05:30	Variant	20	\N	2	zdxfgchvjbkl;bvcfghnhygjyy	18	41	\N	AED	300	{"zonal": 1, "regional": 1, "international": 1}	3.7714285714285714	7	g
\.


--
-- TOC entry 5107 (class 0 OID 16500)
-- Dependencies: 236
-- Data for Name: social_logins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_logins (login_id, customer_id, provider, provider_user_id) FROM stdin;
\.


--
-- TOC entry 5109 (class 0 OID 16504)
-- Dependencies: 238
-- Data for Name: subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subcategories (subcategory_id, subcategory_name, subcategory_description, subcategory_image_url, parent_category_id, created_at, updated_at, subcategory_meta_title) FROM stdin;
54	Watch Accessories	 	 	35	2023-09-13 15:11:44.282011	2023-09-13 15:11:44.282011	\N
55	Women's Jewelery	 	 	35	2023-09-13 15:11:58.362998	2023-09-13 15:11:58.362998	\N
56	Women's Glasses	 	 	35	2023-09-13 15:12:09.599062	2023-09-13 15:12:09.599062	\N
57	Men's Glasses	 	 	35	2023-09-13 15:12:21.574486	2023-09-13 15:12:21.574486	\N
58	Jewelry & Watches	 	 	35	2023-09-13 15:12:38.930672	2023-09-13 15:12:38.930672	\N
59	Piercings	 	 	35	2023-09-13 15:12:51.385028	2023-09-13 15:12:51.385028	\N
60	Furniture	 	 	36	2023-09-13 15:13:12.268032	2023-09-13 15:13:12.268032	\N
61	Kitchenware & Appliances	 	 	36	2023-09-13 15:13:22.415298	2023-09-13 15:13:22.415298	\N
62	Home Decor	 	 	36	2023-09-13 15:13:32.519975	2023-09-13 15:13:32.519975	\N
63	Tools & DIY	 	 	36	2023-09-13 15:13:45.49607	2023-09-13 15:13:45.49607	\N
31	Audio & Headphones 	  	  https://www.svgrepo.com/show/522727/audio-playlist.svg	12	2023-08-01 17:29:13.982484	2023-08-16 11:44:02.007794	\N
64	Skincare & Makeup	 	 	37	2023-09-13 15:14:07.579005	2023-09-13 15:14:07.579005	\N
65	Haircare	 	 	37	2023-09-13 15:14:18.680655	2023-09-13 15:14:18.680655	\N
66	Health & Wellness	 	 	37	2023-09-13 15:14:28.51051	2023-09-13 15:14:28.51051	\N
67	Fragnances	 	 	37	2023-09-13 15:14:39.893067	2023-09-13 15:14:39.893067	\N
36	Women's Abaya	 	 https://static.thenounproject.com/png/544892-200.png	15	2023-08-01 17:34:05.968505	2023-08-16 12:10:19.787863	\N
37	Camera & Photography	 	https://www.svgrepo.com/show/533059/camera.svg	12	2023-08-07 16:28:19.664549	2023-08-21 11:11:09.683801	\N
29	Laptop & Computers	as	https://www.svgrepo.com/show/447989/electronics.svg	12	2023-08-01 12:55:28.868285	2023-08-21 11:11:35.498403	\N
28	Mobile Electronics	as	https://www.svgrepo.com/show/490863/mobile-charge.svg	12	2023-08-01 12:55:17.88686	2023-08-21 11:12:17.647671	\N
34	Women's Jeans	 	https://www.svgrepo.com/show/482437/jeans-4.svg	15	2023-08-01 17:33:44.564661	2023-08-21 11:12:37.743693	\N
35	Women's Hijab	 	https://www.svgrepo.com/show/16659/hijab-veil.svg	15	2023-08-01 17:33:54.797329	2023-08-21 11:13:00.747958	\N
38	Clothing	 	 	16	2023-09-01 11:17:59.315729	2023-09-01 11:17:59.315729	\N
39	Shoes	 	 	16	2023-09-01 11:18:09.415667	2023-09-01 11:18:09.415667	\N
40	Bags & Luggages	 	 	16	2023-09-01 11:18:20.59991	2023-09-01 11:18:20.59991	\N
41	Lawyer for Hire	 	 	18	2023-09-13 12:54:05.248525	2023-09-13 12:54:05.248525	\N
68	Massage Tools & Equipments	 	 	37	2023-09-13 15:14:51.069308	2023-09-13 15:14:51.069308	\N
69	Health Care Products	 	 	37	2023-09-13 15:15:09.660583	2023-09-13 15:15:09.660583	\N
70	Dental Care Products	 	 	37	2023-09-13 15:15:19.390344	2023-09-13 15:15:19.390344	\N
71	Facial Care Products 	 	 	37	2023-09-13 15:15:29.771468	2023-09-13 15:15:29.771468	\N
72	Action Figures & Collectibles	 	 	38	2023-09-13 15:15:55.996167	2023-09-13 15:15:55.996167	\N
73	Board Games and Puzzles	 	 	38	2023-09-13 15:16:12.611313	2023-09-13 15:16:12.611313	\N
74	Outdor Play	 	 	38	2023-09-13 15:16:23.214546	2023-09-13 15:16:23.214546	\N
75	Remote Control Toys	 	 	38	2023-09-13 15:16:34.737817	2023-09-13 15:16:34.737817	\N
76	Ganes & Accessories	 	 	38	2023-09-13 15:16:45.992896	2023-09-13 15:16:45.992896	\N
77	Baby & Toddler Toys	 	 	38	2023-09-13 15:17:00.779197	2023-09-13 15:17:00.779197	\N
78	Fitness & Excercise Equipment	 	 	39	2023-09-13 15:17:38.212786	2023-09-13 15:17:38.212786	\N
79	Camping & Hiking Gear	 	 	39	2023-09-13 15:17:47.989521	2023-09-13 15:17:47.989521	\N
80	Cycling	 	 	39	2023-09-13 15:17:59.043787	2023-09-13 15:17:59.043787	\N
81	Sports Apparel & Footwear	 	 	39	2023-09-13 15:18:10.977853	2023-09-13 15:18:10.977853	\N
82	Fiction & Non-Fictional Books	 	 	40	2023-09-13 15:18:28.270439	2023-09-13 15:18:28.270439	\N
83	School & Office Supplies 	 	 	40	2023-09-13 15:18:44.883777	2023-09-13 15:18:44.883777	\N
84	Art & Craft Supplies	 	 	40	2023-09-13 15:19:02.610939	2023-09-13 15:19:02.610939	\N
85	Fresh Fruits & Vegetables	 	 	41	2023-09-13 15:19:18.720458	2023-09-13 15:19:18.720458	\N
86	Dry Fruits & Nuts	 	 	41	2023-09-13 15:19:31.557606	2023-09-13 15:19:31.557606	\N
87	Beverages & Juices	 	 	41	2023-09-13 15:19:45.061764	2023-09-13 15:19:45.061764	\N
88	Snacks & Sweets	 	 	41	2023-09-13 15:20:01.031672	2023-09-13 15:20:01.031672	\N
89	T-Shirts and Polos	 	 	42	2023-09-13 15:20:19.54971	2023-09-13 15:20:19.54971	\N
90	Shirts and Dress Shirts	 	 	42	2023-09-13 15:20:32.317987	2023-09-13 15:20:32.317987	\N
91	Jackets & Coats	 	 	42	2023-09-13 15:23:19.280432	2023-09-13 15:23:19.280432	\N
92	Jeans and Pants	 	 	42	2023-09-13 15:23:36.520303	2023-09-13 15:23:36.520303	\N
93	Kurta & Pajamas	 	 	42	2023-09-13 15:23:50.550343	2023-09-13 15:23:50.550343	\N
94	Swimwear	 	 	42	2023-09-13 15:24:20.960482	2023-09-13 15:24:20.960482	\N
95	Shorts	 	 	42	2023-09-13 15:26:04.511682	2023-09-13 15:26:04.511682	\N
96	Cars & Trucks	 	 	43	2023-09-13 15:27:45.526454	2023-09-13 15:27:45.526454	\N
97	Auto Parts & Accessories	 	 	43	2023-09-13 15:27:58.013066	2023-09-13 15:27:58.013066	\N
98	Motorcycles & Scooters	 	 	43	2023-09-13 15:28:09.720228	2023-09-13 15:28:09.720228	\N
99	Car Rentals & Services	 	 	43	2023-09-13 15:28:45.735073	2023-09-13 15:28:45.735073	\N
100	TukTuk Rentals & Services	 	 	43	2023-09-13 15:28:58.815272	2023-09-13 15:28:58.815272	\N
101	TukTuk Parts & Accessories	 	 	43	2023-09-13 15:29:27.261242	2023-09-13 15:29:27.261242	\N
102	TukTuk for Sale	 	 	43	2023-09-13 15:29:39.918229	2023-09-13 15:29:39.918229	\N
103	Baby's Gear	 	 	44	2023-09-13 15:29:59.428619	2023-09-13 15:29:59.428619	\N
104	Kids Clothing & Accessories	 	 	44	2023-09-13 15:30:35.628601	2023-09-13 15:30:35.628601	\N
105	Toys & Educational Items	 	 	44	2023-09-13 15:30:56.868398	2023-09-13 15:30:56.868398	\N
106	Musical Instruments	 	 	50	2023-09-13 15:32:36.222134	2023-09-13 15:32:36.222134	\N
107	Sheet Music & Song Books	 	 	50	2023-09-13 15:33:18.753682	2023-09-13 15:33:18.753682	\N
108	Audio Equipment & Speakers	 	 	50	2023-09-13 15:33:30.008768	2023-09-13 15:33:30.008768	\N
109	Music Lessons	 	 	50	2023-09-13 15:33:41.838925	2023-09-13 15:33:41.838925	\N
110	Refrigerators & Freezers	 	 	49	2023-09-13 15:33:53.803349	2023-09-13 15:33:53.803349	\N
111	Washing Machines & Dryers	 	 	49	2023-09-13 15:34:03.611075	2023-09-13 15:34:03.611075	\N
112	Air Conditioners & Heaters	 	 	49	2023-09-13 15:34:14.709346	2023-09-13 15:34:14.709346	\N
113	Vacuum Cleaners	 	 	49	2023-09-13 15:34:29.312955	2023-09-13 15:34:29.312955	\N
115	Chargers & Cables	  	 	48	2023-09-13 15:36:25.857359	2023-09-13 15:36:25.857359	\N
116	Laptop Bags & Sleeves	 	 	48	2023-09-13 15:36:35.243251	2023-09-13 15:36:35.243251	\N
117	Camera Accessories	 	 	48	2023-09-13 15:36:48.785154	2023-09-13 15:36:48.785154	\N
118	Phone Cases & Covers	 	 	48	2023-09-13 15:37:23.926364	2023-09-13 15:37:23.926364	\N
119	Smart Lightining	 	 	47	2023-09-13 15:38:04.332274	2023-09-13 15:38:04.332274	\N
120	Home Entertainment	 	 	47	2023-09-13 15:38:16.476775	2023-09-13 15:38:16.476775	\N
121	Wifi & Networking	 	 	47	2023-09-13 15:39:04.907737	2023-09-13 15:39:04.907737	\N
122	Paintings & Artwork	 	 	46	2023-09-13 15:39:20.025862	2023-09-13 15:39:20.025862	\N
123	Sculptures & Statues	 	 	46	2023-09-13 15:39:32.857293	2023-09-13 15:39:32.857293	\N
124	Antiques & Vintage Items	 	 	46	2023-09-13 15:39:43.210151	2023-09-13 15:39:43.210151	\N
125	Coins & Stamps	 	 	46	2023-09-13 15:39:54.967251	2023-09-13 15:39:54.967251	\N
126	Gift Wrapping & Craft Supplies	 	 	45	2023-09-13 15:40:10.3714	2023-09-13 15:40:10.3714	\N
127	Office Electronics	 	 	45	2023-09-13 15:40:22.717365	2023-09-13 15:40:22.717365	\N
128	Storage and Organization	 	 	45	2023-09-13 15:40:32.826161	2023-09-13 15:40:32.826161	\N
129	Legal Document Preparation	 	 	18	2023-09-13 15:41:01.994709	2023-09-13 15:41:01.994709	\N
130	Notary Services	 	 	18	2023-09-13 15:41:13.723203	2023-09-13 15:41:13.723203	\N
131	Patent & Trademark Services	 	 	18	2023-09-13 15:41:25.546286	2023-09-13 15:41:25.546286	\N
132	Typing & Transcription	 	 	51	2023-09-13 15:41:41.137699	2023-09-13 15:41:41.137699	\N
133	Graphic Design	 	 	51	2023-09-13 15:41:52.758063	2023-09-13 15:41:52.758063	\N
134	Content Writing & Translation	 	 	51	2023-09-13 15:42:01.682245	2023-09-13 15:42:01.682245	\N
135	Virtual Assistance	 	 	51	2023-09-13 15:42:12.403691	2023-09-13 15:42:12.403691	\N
136	Land for Sale	 	 	52	2023-09-13 15:42:26.887601	2023-09-13 15:42:26.887601	\N
137	Apartments for Rent	 	 	52	2023-09-13 15:42:35.800893	2023-09-13 15:42:35.800893	\N
138	Property Management	 	 	52	2023-09-13 15:42:45.580439	2023-09-13 15:42:45.580439	\N
139	Vocation Rentals	 	 	52	2023-09-13 15:43:02.074335	2023-09-13 15:43:02.074335	\N
140	Event Planning & Coordination	 	 	53	2023-09-13 15:43:15.26408	2023-09-13 15:43:15.26408	\N
141	Catering & Food Services	 	 	53	2023-09-13 15:44:18.406602	2023-09-13 15:44:18.406602	\N
142	Photography & Videography	 	 	53	2023-09-13 15:44:28.160075	2023-09-13 15:44:28.160075	\N
143	Entertainment & Performers	 	 	53	2023-09-13 15:44:41.453242	2023-09-13 15:44:41.453242	\N
144	Mobile Phone Repairs	 	 	54	2023-09-13 15:45:36.568022	2023-09-13 15:45:36.568022	\N
145	Laptop & Computer Repairs	 	 	54	2023-09-13 15:45:47.3757	2023-09-13 15:45:47.3757	\N
146	TV & Appliance Repairs	 	 	54	2023-09-13 15:46:00.974247	2023-09-13 15:46:00.974247	\N
147	Camera & Photography Equipment Repairs	 	 	54	2023-09-13 15:46:11.485255	2023-09-13 15:46:11.485255	\N
148	Job Offers	 	 	55	2023-09-13 15:46:30.919153	2023-09-13 15:46:30.919153	\N
149	Job Seekers	 	 	55	2023-09-13 15:46:42.742415	2023-09-13 15:46:42.742415	\N
150	Freelance Gigs	 	 	55	2023-09-13 15:46:52.770647	2023-09-13 15:46:52.770647	\N
151	Pet Services	 	 	55	2023-09-13 15:47:05.292764	2023-09-13 15:47:05.292764	\N
152	Personal Trainers	 	 	56	2023-09-13 15:47:21.716703	2023-09-13 15:47:21.716703	\N
153	Nutrionists & Diatitians	 	 	56	2023-09-13 15:47:32.777109	2023-09-13 15:47:32.777109	\N
154	Yoga & Pilates Instructors	 	 	56	2023-09-13 15:47:43.9897	2023-09-13 15:47:43.9897	\N
155	Sports Coaches	 	 	56	2023-09-13 15:47:54.633517	2023-09-13 15:47:54.633517	\N
156	Accounting & Bookkeeping	 	 	57	2023-09-13 15:48:15.099623	2023-09-13 15:48:15.099623	\N
157	Marketing & Advertising	 	 	57	2023-09-13 15:48:27.196238	2023-09-13 15:48:27.196238	\N
158	Business Consultation	 	 	57	2023-09-13 15:48:39.236996	2023-09-13 15:48:39.236996	\N
159	Office Space & Coworking	 	 	57	2023-09-13 15:49:17.806157	2023-09-13 15:49:17.806157	\N
160	Grocery Delivery	 	 	58	2023-09-13 15:49:31.822022	2023-09-13 15:49:31.822022	\N
161	Meal Kit Delivery	 	 	58	2023-09-13 15:49:53.834487	2023-09-13 15:49:53.834487	\N
162	Specialty Food Delivery	 	 	58	2023-09-13 15:50:03.433979	2023-09-13 15:50:03.433979	\N
163	Online Courses & Tutorials	 	 	59	2023-09-13 15:50:17.84504	2023-09-13 15:50:17.84504	\N
164	Tutoring & Academic Support	 	 	59	2023-09-13 15:50:27.011616	2023-09-13 15:50:27.011616	\N
165	Language Learning Services	 	 	59	2023-09-13 15:50:37.538734	2023-09-13 15:50:37.538734	\N
166	Professional Development	 	 	59	2023-09-13 15:50:48.234467	2023-09-13 15:50:48.234467	\N
167	Salon Services	 	 	60	2023-09-13 15:51:12.909258	2023-09-13 15:51:12.909258	\N
168	Spa Treatments	 	 	60	2023-09-13 15:51:35.997674	2023-09-13 15:51:35.997674	\N
169	Makeup Artists	 	 	60	2023-09-13 15:51:49.715722	2023-09-13 15:51:49.715722	\N
170	Beauty Workshops	 	 	60	2023-09-13 15:51:59.378112	2023-09-13 15:51:59.378112	\N
171	Travel Packages & Tours	 	 	61	2023-09-13 15:52:16.086717	2023-09-13 15:52:16.086717	\N
172	Concert & Event Tickets	 	 	61	2023-09-13 15:52:25.35175	2023-09-13 15:52:25.35175	\N
173	Experiential Workshops	 	 	61	2023-09-13 15:52:36.730578	2023-09-13 15:52:36.730578	\N
174	Handmade Jewelry	 	 	62	2023-09-13 15:52:56.115085	2023-09-13 15:52:56.115085	\N
175	Handcrafted Home Decor	 	 	62	2023-09-13 15:53:07.196396	2023-09-13 15:53:07.196396	\N
176	DIY Craft Supplies	 	 	62	2023-09-13 15:53:18.813546	2023-09-13 15:53:18.813546	\N
177	Knitted & Crocheted Items	 	 	62	2023-09-13 15:53:33.483445	2023-09-13 15:53:33.483445	\N
178	Online Dating	 	 	63	2023-09-13 15:53:49.965069	2023-09-13 15:53:49.965069	\N
179	Speed Dating	 	 	63	2023-09-13 15:53:59.749407	2023-09-13 15:53:59.749407	\N
180	Matchmaking Services	 	 	63	2023-09-13 15:54:09.698497	2023-09-13 15:54:09.698497	\N
181	Causual Dating	 	 	63	2023-09-13 15:54:22.421912	2023-09-13 15:54:22.421912	\N
182	Serious Relationships	 	 	63	2023-09-13 15:54:36.426197	2023-09-13 15:54:36.426197	\N
183	Religious Dating	 	 	63	2023-09-13 15:54:50.849085	2023-09-13 15:54:50.849085	\N
184	Footwear	footwear	https://th.bing.com/th/id/OIP.EDsrNGizp7NmFPvyXJcrLwHaF7?w=242&h=194&c=7&r=0&o=5&pid=1.7	64	2023-10-05 14:41:47.242206	2023-10-05 14:41:47.242206	\N
185	Footwear	bhgb	https://th.bing.com/th/id/OIP.osXbQ2YMGxrMoBSbkFOsJwHaHa?w=153&h=180&c=7&r=0&o=5&pid=1.7	64	2023-10-05 15:10:09.331821	2023-10-05 15:10:31.332288	111111111111
188	Kanjivaram	Kanjivaram	https://th.bing.com/th/id/OIP.osXbQ2YMGxrMoBSbkFOsJwHaHa?w=153&h=180&c=7&r=0&o=5&pid=1.7	67	2023-10-31 17:52:45.828713	2023-10-31 17:52:45.828713	Kanjivaram
\.


--
-- TOC entry 5111 (class 0 OID 16512)
-- Dependencies: 240
-- Data for Name: superadmin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.superadmin (id, email, password, "userId", role_id, "position", name) FROM stdin;
7	45@gmail.com	$2b$10$/GJ6yW08sLkF12Br9IA3Qu9focR0S9ekuRhZWgDfPfYmw.7BTMyuO	f7TMRkPYaf8!6BcJ1uVz	{1,2}	Staff	Sahil Afroz
8	mehtab@gmail.com	$2b$10$rGZG/ZW/zwMamjZNNI.or.9wKH0mz6jn/n8uCF3eSW4X..7xpW/16	v4bTckM7qg(d9XlNdc)J	{3}	Admin	Mehtab 
20	20dco07@aiktc.ac.in	$2b$10$X7lCu2cjEr0vdMAPWXmEb.zPlSFRqhpm47xgcMgm35yY.VtdZwd5a	\N	{1,6,4,3,2}	Staff	Aditi Patil
1	admin@gmail.com	$2b$10$YcJSjGzemyaX/YAzY0okau0dnysMaO.YR2RChcKIiTs/m3q7x5vzi	Jp$J%1XA7WCjezhBC0zu	{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19}	Admin	Shadab Khan
16	patiladiti240@gmail.com	$2b$10$WhJ8DJeSDaxwSxD0noYlXe64A2Otke8XxWQ.Pa6jDlbGcxM0ydsSS	\N	{3,6}	Admin	Aditi Patil
\.


--
-- TOC entry 5125 (class 0 OID 16656)
-- Dependencies: 254
-- Data for Name: support_ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_ticket (ticket_id, subject, status, "timestamp", customer_id) FROM stdin;
4	s1	Open	2023-10-26 16:35:26.769975+05:30	62
5	s1	Open	2023-10-26 16:38:28.944081+05:30	62
6	s1	Open	2023-10-26 16:38:39.044911+05:30	62
7	s1	Open	2023-10-26 16:39:08.748468+05:30	62
8	s1	Open	2023-10-26 16:41:05.340287+05:30	62
9	s1	Open	2023-10-26 16:53:42.54689+05:30	62
10	s1	Closed	2023-10-26 16:54:15.885691+05:30	62
3	Test Ticket 2	In Progress	2023-10-26 15:02:12.170174+05:30	65
11	Attachments upload	Closed	2023-10-27 10:59:46.852726+05:30	66
2	Test Ticket 1	Closed	\N	65
\.


--
-- TOC entry 5127 (class 0 OID 16671)
-- Dependencies: 256
-- Data for Name: support_ticket_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_ticket_messages (message_id, ticket_id, customer_id, message, "timestamp", attachments) FROM stdin;
1	2	65	I am testing the Support Ticket system	2023-10-26 15:25:57.89243+05:30	\N
2	2	\N	Thats great nice to hear that	2023-10-26 15:28:01.940537+05:30	\N
3	2	65	Whatup with u?	2023-10-26 15:35:34.491265+05:30	\N
4	3	66	Hellooo	2023-10-26 15:38:52.647158+05:30	\N
5	3	\N	Hii	2023-10-26 15:39:03.95241+05:30	\N
6	3	\N	ok have a look at this pictures	2023-10-26 15:58:31.573628+05:30	["ig.png", "ig2.jpg"]
7	8	62	s1 test	2023-10-26 16:41:05.348873+05:30	["image.jpg", "image1.jpg"]
8	9	62	s1 test	2023-10-26 16:53:42.555126+05:30	["image.jpg", "image1.jpg"]
9	10	62	s1 test	2023-10-26 16:54:15.893348+05:30	["image.jpg", "image1.jpg"]
11	10	62	s1 test third message	2023-10-26 17:36:28.878368+05:30	["image5.jpg", "image5.jpg", "image6.png"]
13	3	62	s1 test third message	2023-10-26 18:03:16.057714+05:30	["image5.jpg", "image5.jpg", "image6.png"]
10	10	\N	s1 test second message	2023-10-26 17:34:52.795703+05:30	["image5.jpg", "image5.jpg", "image6.png"]
12	3	\N	s1 test third message	2023-10-26 18:01:00.236084+05:30	["image5.jpg", "image5.jpg", "image6.png"]
14	11	66	Trying to upload attachments	2023-10-27 10:59:46.876558+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698384586779 - apple-logo.png", "uploads\\\\customerProfileImages\\\\Customer-Profile-1698384586782 - linux-logo.png"]
15	11	\N	now sending second message for the uploading the files	2023-10-27 11:22:01.065293+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698385920984 - pdf-icon.png", "uploads\\\\customerProfileImages\\\\Customer-Profile-1698385920985 - twitter-bird.png"]
16	11	\N	hgh	2023-10-28 14:38:23.056694+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698484102975 - 2525121.jpg", "uploads\\\\customerProfileImages\\\\Customer-Profile-1698484102977 - 5298659.png"]
17	11	\N	ok	2023-10-28 14:56:40.852716+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698485200764 - 5298659.png"]
18	11	\N	hii	2023-10-28 14:59:41.901922+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698485381821 - 5298659.png"]
19	11	\N	ok ok	2023-10-28 15:02:03.915769+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698485523815 - 5298659.png"]
20	11	\N	ok then	2023-10-28 15:03:36.558446+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698485616476 - 2525121.jpg"]
21	11	\N	form reset	2023-10-28 15:16:26.742689+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698486386665 - 5298659.png"]
22	11	\N	form closed	2023-10-28 15:20:41.750371+05:30	[]
23	9	\N	ok	2023-10-28 16:28:04.634283+05:30	[]
24	8	\N	ok	2023-10-28 16:37:11.622062+05:30	[]
25	2	\N	ok closing this 	2023-10-28 17:19:15.967882+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698493755845 - doct_aman.jpg"]
26	2	\N	ok close it	2023-10-28 17:20:10.678302+05:30	["uploads\\\\customerProfileImages\\\\Customer-Profile-1698493810595 - bitnami.ico", "uploads\\\\customerProfileImages\\\\Customer-Profile-1698493810596 - doct_aman.jpg"]
\.


--
-- TOC entry 5113 (class 0 OID 16518)
-- Dependencies: 242
-- Data for Name: variantproducts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.variantproducts (variant_id, product_uniqueid, variant_mrp, variant_sellingprice, variant_skuid, variant_quantity, variantsvalues, label, vendori_id) FROM stdin;
15	950171	2001.00	1999.21	SA	21	{"Size":"XL"}	XL	27
16	950171	213.00	12.00	12AA	12	{"Size":"M"}	M	27
17	820198	20.00	12.00	shada12	121	{"Size":"M","Pieces":"10pcs"}	M/10pcs	27
18	820198	211.00	21.00	1asaq1	121	{"Size":"XL","Pieces":"10pcs"}	XL/10pcs	27
19	820198	121.00	11.00	sdskl	121	{"Size":"S","Pieces":"10pcs"}	S/10pcs	27
20	647763	213.00	212.00	sasa	1	{"Size":"M"}	M	27
21	647763	121.00	121.00	sas	12	{"Size":"XL"}	XL	27
\.


--
-- TOC entry 5115 (class 0 OID 16524)
-- Dependencies: 244
-- Data for Name: vendorproductorder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendorproductorder (order_id, vendor_id, product_uniqueid, customer_id, order_date, total_amount, order_status, rejection_reason, product_name, customer_name, product_image, customer_email, customer_phone_number, created_at, currency_symbol, payment_method, payment_status, city, state, country, brand, category, subcategory, product_type, transaction_id, commission_fee, withdrawal_amount, refund_amount, fees_paid, tax_collected) FROM stdin;
3	27	61633	4	2023-09-03 20:47:42	300.00	Delivered	\N	hello	Alice	\N	\N	\N	2023-08-30 09:30:00.9	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	19.05	59.01	2.84	1.85	16.58
8	27	61633	9	2023-09-03 20:47:42	280.00	Delivered	\N	good day	Michael	\N	\N	\N	2023-09-03 21:01:02.345	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	15.62	24.53	6.18	35.87	10.01
10	27	61633	11	2023-09-03 20:47:42	330.00	Delivered	\N	hi again	Mark	\N	\N	\N	2023-09-05 23:45:50.901	SOS	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	12.26	70.34	7.31	85.71	41.36
11	27	61633	12	2023-08-03 20:47:42	270.00	Delivered	\N	hello there	Olivia	\N	\N	\N	2023-09-06 02:12:14.567	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	42.04	20.66	6.46	56.56	25.51
12	27	61633	13	2023-08-03 20:47:42	140.00	Delivered	\N	hi friend	Daniel	\N	\N	\N	2023-09-07 05:45:23.89	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	39.88	1.49	4.26	42.16	49.26
15	27	61633	16	2023-07-03 20:47:42	410.00	Returned	\N	hey you again	Emily	\N	\N	\N	2023-09-10 15:45:56.789	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	42.04	74.34	5.04	35.48	38.61
13	27	61633	14	2023-09-03 20:47:42	240.00	Delivered	\N	greetings again	Sophia	\N	\N	\N	2023-09-08 09:01:34.567	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	20.94	94.77	2.18	1.35	29.26
5	27	61633	6	2023-09-03 20:47:42	180.00	Delivered	\N	salutations	Eve	\N	\N	\N	2023-08-31 12:34:56.789	ETB	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	15.85	55.34	1.19	15.81	49.99
829	27	61633	6	2023-09-03 20:47:42	150.00	Delivered	\N	dummy	Eve	\N	\N	\N	2023-09-03 05:54:10.407	EUR	credit card	Refunded	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	10.00	50.00	5.00	95.09	6.01
7	36	61633	8	2023-09-03 20:47:42	120.00	Confirmed	\N	hey you	Lisa	\N	\N	\N	2023-09-02 18:20:30.405	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	42.65	32.09	8.44	86.75	35.65
9	36	61633	10	2023-09-03 20:47:42	190.00	Delivered	\N	howdy	Sarah	\N	\N	\N	2023-09-04 22:30:40.678	USD	online	\N	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	30.76	10.91	7.10	22.96	18.62
56	36	61633	5	2023-10-24 20:47:42	300.00	Delivered	\N	test	Bob	\N	\N	\N	2023-09-02 04:54:10.407	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	25.00	100.00	0.00	13.47	28.74
14	36	61633	15	2023-10-24 20:47:42	160.00	Returned	\N	hello once more	Matthew	\N	\N	\N	2023-09-09 12:30:45.678	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	23.57	22.50	1.15	9.39	1.08
82	36	61633	6	2023-09-03 20:47:42	1150.00	Confirmed	\N	dummy	Eve	\N	\N	\N	2023-09-03 05:54:10.407	USD	credit card	Refunded	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	10.00	50.00	5.00	30.18	43.51
1	28	61633	65	2023-09-03 20:47:42	200.00	Refunded	\N	hey	sHADAB	\N	\N	\N	2023-08-30 07:24:10.407	USD	online	Paid	\N	\N	\N	\N	Electronics	Audio & Headphones	\N	\N	18.95	85.74	3.40	23.55	19.46
2	36	61633	65	2023-10-24 20:47:42	150.00	Refunded	\N	hi	John	\N	\N	\N	2023-08-30 08:15:20.101	USD	online	\N	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	11.49	7.66	5.45	69.03	7.99
4	27	61633	65	2023-09-03 20:47:42	250.00	Cancelled	\N	greetings	Bob	\N	\N	\N	2023-08-31 11:11:11.111	ETB	online	Paid	\N	\N	\N	\N	Electronics	Audio & Headphones	\N	\N	36.90	29.49	0.52	61.10	11.38
6	27	681852	65	2023-09-03 20:47:42	400.00	Delivered	\N	hi there	Alex	\N	\N	\N	2023-09-01 15:30:45.678	USD	online	\N	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	2.42	71.66	6.59	16.81	6.94
89	30	61633	65	2023-09-03 20:47:42	150.00	Delivered	\N	dummy	Eve	\N	\N	\N	2023-09-03 05:54:10.407	EUR	credit card	Refunded	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	10.00	50.00	5.00	77.78	40.14
116	36	61633	5	2023-09-03 20:47:42	300.00	Returned	\N	test	Bob	\N	\N	\N	2023-09-02 04:54:10.407	USD	online	Paid	\N	\N	\N	\N	Electronics	Mobile Electronics	\N	\N	25.00	100.00	0.00	5.52	5.07
\.


--
-- TOC entry 5117 (class 0 OID 16532)
-- Dependencies: 246
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, country_code, mobile_number, email, password, brand_name, business_model, products, trademark_certificate, company_name, company_city, company_state, company_country, company_zip_code, shipping_address, bank_name, bank_account_number, bank_routing_number, bank_account_name, bank_branch, bank_swift_code, registration_date, mobile_verification_status, email_verification_status, status, business_type, registration_number, tax_id_number, business_address, business_phone, business_email, business_website, business_description, facebook_url, instagram_url, twitter_url, linkedin_url, business_logo_url, business_license_url, return_policy, shipping_policy, terms_and_conditions, payment_info, shipping_info, support_contact, categories, average_rating, total_products, total_sales, support_contact_1, support_contact_2, vendor_profile_picture_url, brand_logo, useridvendor, vendorname, email_otp, mobile_otp, reset_otp) FROM stdin;
31	+44	12132132131	sushil@gmail.com	$2b$10$vgJbnWMTJ5lf8avOEv7rEO5qoMgvHx57muBMRZrZT4TpyI5BWqThS	Sushil pvt ltd	wholesaler	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	August 21st 2023, 5:20:45 pm	f	f	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	*yS9etjmvtwk!jw)V2XS	Sushil Ahmed Khan	\N	\N	\N
28	+1	12321312	1212@gmail.com	$2b$10$VbC7aD6Zb83OR.a3hcJlkO1xJ7MYKxaTpfIynht2me/aLdX9QfzrG	Danish Company	manufacturer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	August 17th 2023, 12:45:50 pm	t	t	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"images": ["Vendor-vendorProfile-1692598449337 - apple-iphone-12-pro-max-dummyapplefsn-original-imafwgcycby9yjcj.webp"]}	\N	itn3HotfrVTMPwTHm!#Z	Mehtab KHan	2412	3218	\N
33	+44	121212	sahil@gmail.com	$2b$10$u9E7tFrTw9EIqM01T3tXnuY1LJbhqNe/XQpxJwGAWIUc7y2p3zIby	Sahl	manufacturer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	August 21st 2023, 5:29:28 pm	t	t	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Ot17gHvA8mqCnBMdkEiN	Sahil	2412	3218	\N
27	+91	9164587584	ks615044@gmail.com	$2b$10$6adQDXzde1kJvhsC5jXeMeX971NZfA3RUaUBMNbUfrzCUDtPpeMqy	Shadab Khan Comp	designer	\N	{"images": ["Vendor-TrademarkCertificate-1692599881748 - notebook-xps-15-9530-t-black-gallery-5.avif"]}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	July 22nd 2023, 5:37:00 pm	t	t	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"images": ["Vendor-vendorProfile-1692599675033 - building6.jpeg"]}	\N	J4cIz(2NBmXMwjI5Uea!	Aftab Khan	2412	3218	5731
32	+44	12312	21321321@gmail.com	$2b$10$hTCQrcJdkK.EZAzo2mWdjevOSflQkjhhpj78vjTvBuXoQFYGoPcDy	Danish Company pvt ltd	wholesaler	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	August 21st 2023, 5:26:00 pm	f	f	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	13231	\N	\N	9486
30	+1	21312321	451@gmail.com	$2b$10$hi1ejQrd.fFnOdIe5Xayuew9D05WZxEGGMj7N2YB71BySm/1vT3si	Abc Company	designer	\N	\N	asdas	as	asd	s	sads	asd	\N	\N	\N	\N	\N	\N	August 17th 2023, 5:28:39 pm	f	f	2	Designing	\N	12121231	\N	asd	sadas@gmail.com	asdas	asdas	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	sd	asdas	\N	\N	cUBpabBn*9OL6VCI5SVA	Shadab Khan	2412	3218	\N
26	+1	1234567890	vendor1@example.com	$2b$10$ZHAm/F79TqJijHZTQ4w.d.godrR75KyOn0F5j3ZuSm7vZZb9cbUve	ABC Electronics	wholesaler	{"images": ["Vendor-Product-1690014061058 - pexels-max-rahubovskiy-8146147.jpg"]}	{"images": ["Vendor-TrademarkCertificate-1691733088270 - indesign2.jpg"]}	XYZ Tech Inc.	NY 10001	New York	US	10001	123 Shipping St	XYZ Bank	987654321	0123456789	John Doe	Manhattan	SWFT-ABCD	July 20th 2023, 11:12:27 am	f	f	1	Wholeseller	\N	12121231	\N	1672635769	asdasd@gmail.com	http://hello.com	this is my business, this is short desciption about me.	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1672635769	1672635769	{"images": ["Vendor-vendorProfile-1690262253106 - download.jpeg"]}	{"images": ["Vendor-vendorBrandLogo-1691733608658 - screenshot (8).png"]}	\N	Danish Shaikh	2412	3218	\N
51	+91	7678063042	20dco07@aiktc.ac.in	$2b$10$07rLmLW4ILPGSdyankIi/eAEiYFZerpR4zXFyWJ9.bgeDZVMY/3Km	Fashion Jalsa	designer	\N	\N	Fashion Jalsa	Mumbai	Maharashtra	India	400709	Same as above	FJ	FJ123	FJ123	Aditi Patil	Mumbai	59455	October 10th 2023, 11:34:20 am	t	t	0	Hybridd	\N	\N	\N	7678063042	20dco07@aiktc.ac.in	https://fashionjalsa.com	It's a Fashion Brand	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5656865678	6868666876	\N	\N	ZU4*mvyxo*qIGwDo$Hq4	Aditi Patil	2412	3218	\N
34	+91	9457421524	ks@gmail.com	$2b$10$nFSXPFwgn2ZX6/fl/./reO4qE7clookquTAb8NLMaHBM4.5p3/pRW	Mustafa Company	wholesaler	\N	\N	Companay 1	Thane	Maharashtra	India	400612	Mumbau	Bank of Maharashtra	4578541258	0123456789	John Doe	Kausa	SWFT-ABCD	August 23rd 2023, 11:33:12 am	t	t	4	Designer	\N	\N	\N	4578745821	comp@rmail.com	https://google.com	Hey this is description	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9167263576	9458745214	\N	\N	RK0hZFpR70iwdaS)ADxR	Mustafa Khan	2412	3218	\N
35	+91	9167263576	shadabpws@gmail.com	$2b$10$1b24O7Mnh9CD1hJSqBG8TOIaEIMsdJhkNh4a8qZQLHftYavzr33iO	SP Mechnic shop	trader	{"images": ["Vendor-Product-1694155056807 - notebook-xps-15-9530-t-black-gallery-3.avif", "Vendor-Product-1694155056817 - notebook-xps-15-9530-t-black-gallery-5.avif"]}	{"images": ["Vendor-TrademarkCertificate-1694154998955 - WhatsApp Image 2023-09-02 at 14.57.46.jpg"]}	Company 1	Thane	Mahrashtra	India	400612	Sayeed Manzil, 104, Hello Gandhi Nagar, Kalwa, India	Bank of Maharashtra	4578541258	14525875	Shadab Khan JM	Kausa	SWFT-ABCD	September 8th 2023, 11:59:27 am	t	t	0	Designing	\N	\N	\N	9167263576	info@gmail.com	https://shadab.com	 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9167263576	87653431123	{"images": ["Vendor-vendorProfile-1694154979598 - spinner1.jpg"]}	{"images": ["Vendor-vendorBrandLogo-1696241892684 - doctor-profile.jpg"]}	SIZoAvo6Om5shD&u*Zf^	Shadab Mumabi	2412	3218	\N
53	+1	7678063042	abc@gmail.com	$2b$10$bt6PYJjSKvHSSqYROT2v/.h.X1BetzMjOJQ96uz6hx6.6nayO1.7u	Sagar Tech	designer	\N	\N	Sagar Tech	400709	Maharashtra	India	400009	400709	\N	\N	\N	\N	\N	\N	November 9th 2023, 3:14:44 pm	f	f	0	Sagar Tech	\N	433434	\N	07678063042	patiladiti240@gmail.com	Sagar Tech	ggb	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5656865678	5656865678	\N	\N	\N	Aditi	7398	3420	\N
36	+91	6534765876	patiladiti240@gmail.com	$2b$10$lgs9dXyU.9JYa9jNnyJzDu7ASYzNoDN6baHwEGGfgl9y9bb6vXbju	Sagar Tech	designer	\N	\N	Sagar Tech	Navi Mumbai	India	India	400709	Same as above	STB	STB123	STB123	Aditi	Mumbai	59455	October 2nd 2023, 3:58:38 pm	t	t	0	none	\N	\N	SS 2A, Room no-107, Sector-5	3455646463	patiladiti240@gmail.com	sagartech.co.in	none	facebook.com	instagram.com	twitter.com	linkedin.com	\N	\N	hii 	ok	bye	\N	\N	\N	\N	\N	\N	\N	5656865678	5656865678	\N	\N	1G)4c*w(r)gHjPnWRm5@	Aditi	2412	3218	6491
29	+44	21312321	ks21@gmail.com	$2b$10$2zfaSAK8fLQOt9gUjLML2ONFC0AY5O7Il7QzrnPawH75ejMnoIPiK	Shadab Khan Ltd	wholesaler	{"images": ["Vendor-Product-1692771776733 - wallpaperflare.com_wallpaper (1).jpg", "Vendor-Product-1692771776742 - wallpaperflare.com_wallpaper (2).jpg"]}	{"images": ["Vendor-TrademarkCertificate-1692599912247 - aqua-glow-ag2000cs-usha-original-imafz62yucjkxta5.webp"]}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	August 17th 2023, 1:02:41 pm	t	t	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	VieALIk40a7Gbm#tDQuf	Shadab Khan	2412	3218	\N
52	+91	7710859196	ms.sayyedaafreen786@gmail.com	$2b$10$mHJAaRTbnD5uzNgSHDl/peQSQvtLJgncoPdLy/w.kEFCm3/VRkK9.	PM Decor	trader	\N	\N	PM Decor	mumbai	Maharashtra	India	400189	Same as above	ABC	ABC123	ABC123	Aafreen	Mumbai	59455	October 10th 2023, 11:52:49 am	t	t	0	Simple	\N	\N	\N	7710859196	ms.sayyedaafreen786@gmail.com	pmdecor.com	Interior design 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5656865678	6868666876	\N	\N	9aGFPPNz3d@gvWa^s0z)	Aafreen Sayyed	3958	4620	3770
\.


--
-- TOC entry 5119 (class 0 OID 16539)
-- Dependencies: 248
-- Data for Name: vendors_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors_notifications (id, vendor_id, type, title, message, date) FROM stdin;
1	27	Payment	Order Received	You have a new order from John Doe	2022-04-10 02:00:00
2	27	Offers	Payment Successful	Payment for order #1234 has been received	2022-04-10 02:00:00
3	27	Offers	Payment Successful	Payment for order #1234 has been received	2022-04-10 02:00:00
4	27	Payment	Order Shipped	Order #1235 has been shipped	2022-04-10 02:00:00
5	27	Payment	Order Received	You have a new order from John Doe	2022-04-10 02:00:00
6	27	Offers	Payment Successful	Payment for order #1234 has been received	2022-04-09 10:00:00
7	27	Offers	Payment Successful	Payment for order #1234 has been received	2023-09-06 10:00:00
8	27	Orders	Order Shipped	Order #1235 has been shipped	2023-09-06 01:00:00
9	27	Order Update	Order Status Update	Order 82 has been updated to Confirmed.	2023-09-11 17:41:59
10	27	Orders	Order Returned	Order 4 has been updated to Returned.	2023-09-11 17:43:41
11	27	Orders	Order Confirmed	Order 7 has been updated to Confirmed.	2023-09-11 17:45:25
12	27	Orders	Order Confirmed	Order #4 has been updated to Confirmed.	2023-09-11 17:56:36
13	27	Orders	Order Cancelled	Order #7 has been updated to Cancelled.	2023-09-13 10:44:24
14	27	Orders	Order Refunded	Order #7 has been updated to Refunded.	2023-09-13 10:48:25
15	27	Orders	Order Refunded	Order #4 has been updated to Refunded.	2023-09-13 10:49:52
16	27	Orders	Order Refunded	Order #2 has been updated to Refunded.	2023-09-13 10:49:58
17	27	Orders	Order Refunded	Order #14 has been updated to Refunded.	2023-09-13 10:55:54
18	27	Orders	Order Confirmed	Order #7 has been updated to Confirmed.	2023-09-16 14:28:44
19	27	Orders	Order Cancelled	Order #4 has been updated to Cancelled.	2023-09-16 14:30:09
20	27	Orders	Order Returned	Order #15 has been updated to Returned.	2023-09-16 14:30:41
21	36	Orders	Order Returned	Order #14 has been updated to Returned.	2023-10-24 11:50:16
22	36	Orders	Order Returned	Order #116 has been updated to Returned.	2023-10-31 14:44:33
\.


--
-- TOC entry 5121 (class 0 OID 16545)
-- Dependencies: 250
-- Data for Name: withdrawals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.withdrawals (withdrawal_id, vendor_id, currency_code, amount, withdrawal_date, status, bank_account_number, bank_name, bank_branch, created_at, updated_at) FROM stdin;
1	1	USD	500.00	2023-09-10	Pending	1234567890	Bank of America	Main Branch	2023-09-02 15:59:09.123084	2023-09-02 15:59:09.123084
2	27	USD	250.00	2023-09-15	Pending	1234567891	Bank of America	Main Branch	2023-09-02 16:17:12.608972	2023-09-02 16:17:12.608972
3	27	USD	300.00	2023-09-18	Approved	1234567892	Wells Fargo	Downtown Branch	2023-09-02 16:17:12.608972	2023-09-02 16:17:12.608972
4	27	EUR	400.00	2023-09-22	Pending	9876543210	European Bank	Central Branch	2023-09-02 16:17:12.608972	2023-09-02 16:17:12.608972
5	27	GBP	600.00	2023-09-25	Approved	5678901234	UK Bank	City Center Branch	2023-09-02 16:17:12.608972	2023-09-02 16:17:12.608972
6	27	CAD	350.00	2023-09-30	Pending	3456789012	Canadian Bank	Downtown Branch	2023-09-02 16:17:12.608972	2023-09-02 16:17:12.608972
\.


--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 253
-- Name: admintags_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admintags_tag_id_seq', 30, true);


--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 217
-- Name: attributes_attribute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attributes_attribute_id_seq', 17, true);


--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 219
-- Name: audio_headphones_product_ah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audio_headphones_product_ah_id_seq', 7, true);


--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 221
-- Name: camera_photography_product_cp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.camera_photography_product_cp_id_seq', 31, true);


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 263
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 16, true);


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 67, true);


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 259
-- Name: contactus_contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contactus_contact_id_seq', 4, true);


--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 274
-- Name: currency_rates_rate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.currency_rates_rate_id_seq', 3, true);


--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 225
-- Name: customer_follows_follow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_follows_follow_id_seq', 19, true);


--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 261
-- Name: customer_wishlist_wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_wishlist_wishlist_id_seq', 10, true);


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 227
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 67, true);


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 229
-- Name: laptopcomputers_product_lc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.laptopcomputers_product_lc_id_seq', 105, true);


--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 266
-- Name: orderitems_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderitems_order_item_id_seq', 10, true);


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 270
-- Name: orderstatushistory_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderstatushistory_status_id_seq', 18, true);


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 232
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 5, true);


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 268
-- Name: paymenttransactions_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paymenttransactions_payment_id_seq', 3, true);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 233
-- Name: product_mobile_electronics_product_me_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_mobile_electronics_product_me_id_seq', 350, true);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 272
-- Name: productreviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productreviews_review_id_seq', 7, true);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 235
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 65, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 237
-- Name: social_logins_login_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_logins_login_id_seq', 1, false);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 239
-- Name: subcategories_subcategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategories_subcategory_id_seq', 188, true);


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 241
-- Name: superadmin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.superadmin_id_seq', 23, true);


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 257
-- Name: support_ticket_messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.support_ticket_messages_message_id_seq', 26, true);


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 255
-- Name: support_ticket_ticket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.support_ticket_ticket_id_seq', 11, true);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 243
-- Name: variantproducts_variant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variantproducts_variant_id_seq', 21, true);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 245
-- Name: vendorproductorder_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendorproductorder_order_id_seq', 10, true);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 247
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 53, true);


--
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 249
-- Name: vendors_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_notifications_id_seq', 22, true);


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 251
-- Name: withdrawals_withdrawal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.withdrawals_withdrawal_id_seq', 6, true);


--
-- TOC entry 4900 (class 2606 OID 16643)
-- Name: admintags admintags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admintags
    ADD CONSTRAINT admintags_pkey PRIMARY KEY (tag_id);


--
-- TOC entry 4858 (class 2606 OID 16570)
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (attribute_id);


--
-- TOC entry 4860 (class 2606 OID 16572)
-- Name: audioheadphones audio_headphones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audioheadphones
    ADD CONSTRAINT audio_headphones_pkey PRIMARY KEY (product_ah_id);


--
-- TOC entry 4862 (class 2606 OID 16574)
-- Name: cameraphotography camera_photography_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cameraphotography
    ADD CONSTRAINT camera_photography_pkey PRIMARY KEY (product_cp_id);


--
-- TOC entry 4910 (class 2606 OID 16724)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 4864 (class 2606 OID 16576)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4906 (class 2606 OID 16697)
-- Name: contactus contactus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactus
    ADD CONSTRAINT contactus_pkey PRIMARY KEY (contact_id);


--
-- TOC entry 4922 (class 2606 OID 16903)
-- Name: currency_rates currency_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_rates
    ADD CONSTRAINT currency_rates_pkey PRIMARY KEY (rate_id);


--
-- TOC entry 4866 (class 2606 OID 16578)
-- Name: customer_follows customer_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_follows
    ADD CONSTRAINT customer_follows_pkey PRIMARY KEY (follow_id);


--
-- TOC entry 4908 (class 2606 OID 16706)
-- Name: customer_wishlist customer_wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_wishlist
    ADD CONSTRAINT customer_wishlist_pkey PRIMARY KEY (wishlist_id);


--
-- TOC entry 4868 (class 2606 OID 16580)
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- TOC entry 4870 (class 2606 OID 16582)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 4872 (class 2606 OID 16584)
-- Name: laptopcomputers laptopcomputers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laptopcomputers
    ADD CONSTRAINT laptopcomputers_pkey PRIMARY KEY (product_lc_id);


--
-- TOC entry 4914 (class 2606 OID 16775)
-- Name: orderitems orderitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_pkey PRIMARY KEY (order_item_id);


--
-- TOC entry 4912 (class 2606 OID 16762)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4918 (class 2606 OID 16813)
-- Name: orderstatushistory orderstatushistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderstatushistory
    ADD CONSTRAINT orderstatushistory_pkey PRIMARY KEY (status_id);


--
-- TOC entry 4876 (class 2606 OID 16586)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4916 (class 2606 OID 16799)
-- Name: paymenttransactions paymenttransactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paymenttransactions
    ADD CONSTRAINT paymenttransactions_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4874 (class 2606 OID 16588)
-- Name: mobileelectronics product_mobile_electronics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mobileelectronics
    ADD CONSTRAINT product_mobile_electronics_pkey PRIMARY KEY (product_me_id);


--
-- TOC entry 4920 (class 2606 OID 16828)
-- Name: productreviews productreviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productreviews
    ADD CONSTRAINT productreviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4878 (class 2606 OID 16590)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 4880 (class 2606 OID 16592)
-- Name: social_logins social_logins_customer_id_provider_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_logins
    ADD CONSTRAINT social_logins_customer_id_provider_key UNIQUE (customer_id, provider);


--
-- TOC entry 4882 (class 2606 OID 16594)
-- Name: social_logins social_logins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_logins
    ADD CONSTRAINT social_logins_pkey PRIMARY KEY (login_id);


--
-- TOC entry 4884 (class 2606 OID 16596)
-- Name: subcategories subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (subcategory_id);


--
-- TOC entry 4886 (class 2606 OID 16598)
-- Name: superadmin superadmin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);


--
-- TOC entry 4888 (class 2606 OID 16600)
-- Name: superadmin superadmin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 16677)
-- Name: support_ticket_messages support_ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_pkey PRIMARY KEY (message_id);


--
-- TOC entry 4902 (class 2606 OID 16663)
-- Name: support_ticket support_ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket
    ADD CONSTRAINT support_ticket_pkey PRIMARY KEY (ticket_id);


--
-- TOC entry 4890 (class 2606 OID 16602)
-- Name: variantproducts variantproducts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantproducts
    ADD CONSTRAINT variantproducts_pkey PRIMARY KEY (variant_id);


--
-- TOC entry 4892 (class 2606 OID 16604)
-- Name: vendorproductorder vendorproductorder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendorproductorder
    ADD CONSTRAINT vendorproductorder_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4896 (class 2606 OID 16606)
-- Name: vendors_notifications vendors_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors_notifications
    ADD CONSTRAINT vendors_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 16608)
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- TOC entry 4898 (class 2606 OID 16610)
-- Name: withdrawals withdrawals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT withdrawals_pkey PRIMARY KEY (withdrawal_id);


--
-- TOC entry 4928 (class 2606 OID 16644)
-- Name: admintags admintags_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admintags
    ADD CONSTRAINT admintags_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- TOC entry 4929 (class 2606 OID 16649)
-- Name: admintags admintags_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admintags
    ADD CONSTRAINT admintags_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(subcategory_id) NOT VALID;


--
-- TOC entry 4923 (class 2606 OID 16611)
-- Name: attributes attributes_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- TOC entry 4924 (class 2606 OID 16616)
-- Name: customer_follows customer_follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_follows
    ADD CONSTRAINT customer_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- TOC entry 4925 (class 2606 OID 16621)
-- Name: customer_follows customer_follows_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_follows
    ADD CONSTRAINT customer_follows_following_id_fkey FOREIGN KEY (follower_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- TOC entry 4935 (class 2606 OID 16725)
-- Name: cart customer_id_cart_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT customer_id_cart_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 4937 (class 2606 OID 16751)
-- Name: orders customer_id_cart_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT customer_id_cart_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 4931 (class 2606 OID 16683)
-- Name: support_ticket_messages customer_id_fk_stm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT customer_id_fk_stm FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 4942 (class 2606 OID 16834)
-- Name: productreviews customer_id_productreviews_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productreviews
    ADD CONSTRAINT customer_id_productreviews_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 4930 (class 2606 OID 16666)
-- Name: support_ticket customer_id_st_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket
    ADD CONSTRAINT customer_id_st_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) NOT VALID;


--
-- TOC entry 4933 (class 2606 OID 16707)
-- Name: customer_wishlist customer_id_wishlist_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_wishlist
    ADD CONSTRAINT customer_id_wishlist_fk FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 4938 (class 2606 OID 16776)
-- Name: orderitems order_id_orderitems_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT order_id_orderitems_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4941 (class 2606 OID 16814)
-- Name: orderstatushistory order_id_orderstatushistory_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderstatushistory
    ADD CONSTRAINT order_id_orderstatushistory_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4940 (class 2606 OID 16800)
-- Name: paymenttransactions order_id_paymenttransactions_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paymenttransactions
    ADD CONSTRAINT order_id_paymenttransactions_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4936 (class 2606 OID 16730)
-- Name: cart product_id_cart_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id_cart_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4939 (class 2606 OID 16786)
-- Name: orderitems product_id_orderitems_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT product_id_orderitems_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4943 (class 2606 OID 16829)
-- Name: productreviews product_id_productreviews_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productreviews
    ADD CONSTRAINT product_id_productreviews_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4934 (class 2606 OID 16712)
-- Name: customer_wishlist product_id_wishlist_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_wishlist
    ADD CONSTRAINT product_id_wishlist_fk FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4926 (class 2606 OID 16626)
-- Name: social_logins social_logins_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_logins
    ADD CONSTRAINT social_logins_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 4927 (class 2606 OID 16631)
-- Name: subcategories subcategories_parent_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- TOC entry 4932 (class 2606 OID 16678)
-- Name: support_ticket_messages ticket_id_fk_stm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT ticket_id_fk_stm FOREIGN KEY (ticket_id) REFERENCES public.support_ticket(ticket_id);


-- Completed on 2023-11-09 18:07:48

--
-- PostgreSQL database dump complete
--

