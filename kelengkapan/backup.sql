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

