--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(128) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    balance bigint DEFAULT 0 NOT NULL,
    country character varying(64),
    city character varying(64),
    street character varying(255),
    role character varying(10) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'supplier'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO "auli.aziz";

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO "auli.aziz";

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.users (user_id, name, email, password, balance, country, city, street, role) FROM stdin;
1	test	test@gmail.com	$2a$10$xOe0R93xE.eDwugsA./k7.6cmG8Dt2ByItpePh2Xy2a0yfSBdQDVW	0	\N	\N	\N	user
2	test2	test2@gmail.com	$2a$10$7WpfH/q8UfH2pK9iWt6Jae0pK.MdY/0ewiiVn6tWwl.tMcKtDJrqG	0	\N	\N	\N	supplier
3	test3	test3@gmail.com	$2a$10$7VfwQteqPAD0E11A6Gk5A.SRRJBwdVqiakf6NlCiYh1BNEv.sOZSC	0	\N	\N	\N	supplier
\.


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.2

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
-- Name: food_type; Type: TYPE; Schema: public; Owner: auli.aziz
--

CREATE TYPE public.food_type AS ENUM (
    'fruits',
    'vegetables',
    'grains',
    'bread',
    'pasta',
    'meat',
    'seafood',
    'eggs',
    'dairy',
    'nuts',
    'fermented',
    'oils',
    'others'
);


ALTER TYPE public.food_type OWNER TO "auli.aziz";

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: auli.aziz
--

CREATE TYPE public.order_status AS ENUM (
    'awaiting_payment',
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'completed',
    'failed'
);


ALTER TYPE public.order_status OWNER TO "auli.aziz";

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: auli.aziz
--

CREATE TYPE public.payment_status AS ENUM (
    'awaiting_payment',
    'success',
    'failed'
);


ALTER TYPE public.payment_status OWNER TO "auli.aziz";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public."Order" (
    order_id integer NOT NULL,
    order_date timestamp without time zone NOT NULL,
    status public.order_status NOT NULL,
    user_id integer
);


ALTER TABLE public."Order" OWNER TO "auli.aziz";

--
-- Name: Order_order_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public."Order_order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_order_id_seq" OWNER TO "auli.aziz";

--
-- Name: Order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public."Order_order_id_seq" OWNED BY public."Order".order_id;


--
-- Name: orderitem; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.orderitem (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.orderitem OWNER TO "auli.aziz";

--
-- Name: payment; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    user_id integer,
    order_id integer,
    method character varying(64) NOT NULL,
    payment_status public.payment_status NOT NULL,
    total_amount numeric(10,2) NOT NULL
);


ALTER TABLE public.payment OWNER TO "auli.aziz";

--
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_payment_id_seq OWNER TO "auli.aziz";

--
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    name character varying(128) NOT NULL,
    description character varying,
    brand character varying(64),
    expired date,
    stock integer NOT NULL,
    price numeric(10,2) NOT NULL,
    type public.food_type NOT NULL,
    avg_rating numeric(2,1) DEFAULT 0,
    seller_id integer
);


ALTER TABLE public.product OWNER TO "auli.aziz";

--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_product_id_seq OWNER TO "auli.aziz";

--
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public.product_product_id_seq OWNED BY public.product.product_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(128) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    balance bigint DEFAULT 0 NOT NULL,
    country character varying(64),
    city character varying(64),
    street character varying(255),
    role character varying(10) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'supplier'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO "auli.aziz";

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO "auli.aziz";

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: Order order_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public."Order" ALTER COLUMN order_id SET DEFAULT nextval('public."Order_order_id_seq"'::regclass);


--
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.product_product_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public."Order" (order_id, order_date, status, user_id) FROM stdin;
7	2024-05-26 00:47:16.205	awaiting_payment	1
\.


--
-- Data for Name: orderitem; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.orderitem (order_id, product_id, quantity) FROM stdin;
7	1	2
7	2	1
7	3	5
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.payment (payment_id, user_id, order_id, method, payment_status, total_amount) FROM stdin;
3	1	7	credit_card	awaiting_payment	999.00
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.product (product_id, name, description, brand, expired, stock, price, type, avg_rating, seller_id) FROM stdin;
1	Cow	a dummy cow	\N	\N	5	100.00	meat	\N	2
2	Chicken	a dummy chicken	\N	\N	5	100.00	meat	\N	2
5	Onion	yummy onions	\N	\N	10	10.00	vegetables	\N	3
3	updated product	a dummy cartoon	kalbe	2023-01-01	12	990.00	meat	\N	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.users (user_id, name, email, password, balance, country, city, street, role) FROM stdin;
1	test	test@gmail.com	$2a$10$xOe0R93xE.eDwugsA./k7.6cmG8Dt2ByItpePh2Xy2a0yfSBdQDVW	0	\N	\N	\N	user
2	test2	test2@gmail.com	$2a$10$7WpfH/q8UfH2pK9iWt6Jae0pK.MdY/0ewiiVn6tWwl.tMcKtDJrqG	0	\N	\N	\N	supplier
3	test3	test3@gmail.com	$2a$10$7VfwQteqPAD0E11A6Gk5A.SRRJBwdVqiakf6NlCiYh1BNEv.sOZSC	0	\N	\N	\N	supplier
4	user1	user1@gmail.com	$2a$10$9AzFOdFIJ.CkxxhjTKHDEOe1mQi.1QTkTCcQn3FcjlMh5u0EJkpLW	0	\N	\N	\N	user
\.


--
-- Name: Order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public."Order_order_id_seq"', 7, true);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 3, true);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public.product_product_id_seq', 5, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (order_id);


--
-- Name: orderitem orderitem_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_pkey PRIMARY KEY (order_id, product_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: Order Order_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: orderitem orderitem_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."Order"(order_id);


--
-- Name: payment payment_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."Order"(order_id);


--
-- Name: payment payment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: product product_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(user_id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.2

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
-- Name: food_type; Type: TYPE; Schema: public; Owner: auli.aziz
--

CREATE TYPE public.food_type AS ENUM (
    'fruits',
    'vegetables',
    'grains',
    'bread',
    'pasta',
    'meat',
    'seafood',
    'eggs',
    'dairy',
    'nuts',
    'fermented',
    'oils',
    'others'
);


ALTER TYPE public.food_type OWNER TO "auli.aziz";

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: auli.aziz
--

CREATE TYPE public.order_status AS ENUM (
    'awaiting_payment',
    'pending',
    'processing',
    'delivered',
    'cancelled',
    'completed',
    'failed'
);


ALTER TYPE public.order_status OWNER TO "auli.aziz";

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: auli.aziz
--

CREATE TYPE public.payment_status AS ENUM (
    'awaiting_payment',
    'success',
    'failed'
);


ALTER TYPE public.payment_status OWNER TO "auli.aziz";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public."Order" (
    order_id integer NOT NULL,
    order_date timestamp without time zone NOT NULL,
    status public.order_status NOT NULL,
    user_id integer
);


ALTER TABLE public."Order" OWNER TO "auli.aziz";

--
-- Name: Order_order_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public."Order_order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_order_id_seq" OWNER TO "auli.aziz";

--
-- Name: Order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public."Order_order_id_seq" OWNED BY public."Order".order_id;


--
-- Name: orderaddress; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.orderaddress (
    order_id integer NOT NULL,
    city character varying(64) NOT NULL,
    street character varying(255) NOT NULL,
    country character varying(64) NOT NULL
);


ALTER TABLE public.orderaddress OWNER TO "auli.aziz";

--
-- Name: orderitem; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.orderitem (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    seller_id integer,
    quantity integer NOT NULL
);


ALTER TABLE public.orderitem OWNER TO "auli.aziz";

--
-- Name: payment; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    user_id integer,
    order_id integer,
    method character varying(64) NOT NULL,
    payment_status public.payment_status NOT NULL,
    total_amount numeric(10,2) NOT NULL
);


ALTER TABLE public.payment OWNER TO "auli.aziz";

--
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_payment_id_seq OWNER TO "auli.aziz";

--
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    name character varying(128) NOT NULL,
    description character varying,
    brand character varying(64),
    expired date,
    stock integer NOT NULL,
    price numeric(10,2) NOT NULL,
    type public.food_type NOT NULL,
    avg_rating numeric(2,1) DEFAULT 0,
    seller_id integer,
    image character varying
);


ALTER TABLE public.product OWNER TO "auli.aziz";

--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_product_id_seq OWNER TO "auli.aziz";

--
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public.product_product_id_seq OWNED BY public.product.product_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: auli.aziz
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(128) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    balance numeric(10,2) DEFAULT 0 NOT NULL,
    role character varying(10) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'supplier'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO "auli.aziz";

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: auli.aziz
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO "auli.aziz";

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: auli.aziz
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: Order order_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public."Order" ALTER COLUMN order_id SET DEFAULT nextval('public."Order_order_id_seq"'::regclass);


--
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.product_product_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public."Order" (order_id, order_date, status, user_id) FROM stdin;
4	2024-05-28 22:18:01.786	awaiting_payment	10
2	2024-05-28 22:01:28.502	cancelled	1
3	2024-05-28 22:16:22.42	cancelled	10
5	2024-05-29 00:19:49.129	awaiting_payment	10
6	2024-05-29 00:19:50.931	awaiting_payment	10
7	2024-05-29 00:19:53.056	awaiting_payment	10
8	2024-05-29 00:21:20.711	awaiting_payment	1
1	2024-05-28 22:00:59.312	completed	1
10	2024-05-29 00:21:23.542	completed	1
9	2024-05-29 00:21:22.306	pending	1
11	2024-05-29 21:54:13.112	awaiting_payment	13
12	2024-05-29 21:58:21.373	awaiting_payment	13
13	2024-05-29 21:59:34.516	awaiting_payment	13
14	2024-05-29 21:59:37.434	awaiting_payment	13
\.


--
-- Data for Name: orderaddress; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.orderaddress (order_id, city, street, country) FROM stdin;
1	Depok	Jl H Amat	Indonesia
4	Sydney	Moubarly Road	Australia
5	Sydney	Moubarly Road	Australia
6	Sydney	Moubarly Road	Australia
7	Sydney	Moubarly Road	Australia
8	Paris	Rue LaMartin	Frach
9	Paris	Rue LaMartin	Frach
10	Paris	Rue LaMartin	Frach
11	Paris	Rue LaMartin	Frach
12	Paris	Rue LaMartin	Frach
13	Paris	Rue LaMartin	Frach
14	Paris	Rue LaMartin	Frach
\.


--
-- Data for Name: orderitem; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.orderitem (order_id, product_id, seller_id, quantity) FROM stdin;
1	1	2	9
1	2	2	9
1	3	2	9
4	1	2	10
4	2	2	10
4	3	2	10
5	1	2	10
5	2	2	10
5	3	2	10
6	1	2	10
6	2	2	10
6	3	2	10
7	1	2	10
7	2	2	10
7	3	2	10
8	1	2	9
8	2	2	99
8	3	2	11
9	1	2	9
9	2	2	99
9	3	2	11
10	1	2	9
10	2	2	99
10	3	2	11
11	2	2	3
11	3	2	4
12	3	2	1
13	3	2	1
14	3	2	1
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.payment (payment_id, user_id, order_id, method, payment_status, total_amount) FROM stdin;
1	1	1	cash	awaiting_payment	1999.00
4	10	4	cash	awaiting_payment	19399.00
2	1	2	cash	failed	19399.00
3	10	3	cash	failed	19399.00
5	10	5	cash	awaiting_payment	19399.00
6	10	6	cash	awaiting_payment	19399.00
7	10	7	cash	awaiting_payment	19399.00
8	1	8	cash	awaiting_payment	1000.00
10	1	10	cash	awaiting_payment	1000.00
9	1	9	cash	success	1000.00
11	13	11	cash	awaiting_payment	1000.00
12	13	12	cash	awaiting_payment	1000.00
13	13	13	cash	awaiting_payment	1000.00
14	13	14	cash	awaiting_payment	1000.00
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.product (product_id, name, description, brand, expired, stock, price, type, avg_rating, seller_id, image) FROM stdin;
2	Chicken	a dummy chicken	\N	\N	5	100.00	meat	\N	2	\N
5	Onion	yummy onions	\N	\N	10	10.00	vegetables	\N	3	\N
3	updated product lemonn	\N	springton	2023-01-01	12	990.00	others	\N	2	\N
1	updated cow	la vache	hamiltonian	2024-01-01	12	990.00	meat	\N	2	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: auli.aziz
--

COPY public.users (user_id, name, email, password, balance, role) FROM stdin;
9	test3	test3@gmail.com	$2a$10$1XQFpRkf6BO492.5T7W74Ou33bDCuDKMVp9YyUJPXBqI0NHAsKqnK	0.00	supplier
10	test4	test4@gmail.com	$2a$10$6RrUtkJ6m8RfmjCRl7Tbw.EEXbXnZHMlgO0OMhhsptF9UcLrjt1kS	0.00	user
2	test2	test2@gmail.com	$2a$10$U.ROUSSN5LnQMm1/04tikeftJnvZzj6ES0T9KyFq8hFgCHIqrHI9m	1000.00	supplier
1	test	test@gmail.com	$2a$10$P6StfqRKxszhkQuVfcYlq.QtdoKAV5S7zMHnA8V1gsIWDzhFd0/5a	10000000.00	user
11	aulia	aulia@gmail.com	$2a$10$NSQNwtyepecZDRvTxPu/.uQRCznnM652bYF9HeTAXv/FwgIov2VaW	0.00	user
12	auli	aulia2@gmail.com	$2a$10$aY1RWcaUq4PEBJqwmTS50eKKYrYE.koBXxBSxm9hcJ0YpdZ1rI8LK	0.00	user
13	john	john@gmail.com	$2a$10$RmbvhFhwdTZncCf0esNFruBZEBMG2HzpNfuBoFJkWFG5vr0lohxRu	0.00	user
14	john doe	doe@gmail.com	$2a$10$.WxRo.TM4CSwAOmBPIF2KOjUmGcuDa6B6dafEa2jGxMAH3cUpUDeK	0.00	user
\.


--
-- Name: Order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public."Order_order_id_seq"', 14, true);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 14, true);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public.product_product_id_seq', 6, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auli.aziz
--

SELECT pg_catalog.setval('public.users_user_id_seq', 14, true);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (order_id);


--
-- Name: orderaddress orderaddress_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderaddress
    ADD CONSTRAINT orderaddress_pkey PRIMARY KEY (order_id);


--
-- Name: orderitem orderitem_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_pkey PRIMARY KEY (order_id, product_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: Order Order_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: orderaddress orderaddress_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderaddress
    ADD CONSTRAINT orderaddress_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."Order"(order_id);


--
-- Name: orderitem orderitem_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."Order"(order_id);


--
-- Name: orderitem orderitem_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: orderitem orderitem_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(user_id);


--
-- Name: payment payment_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."Order"(order_id);


--
-- Name: payment payment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auli.aziz
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

