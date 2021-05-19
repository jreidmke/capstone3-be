PGDMP     ,    5                y           print    13.1    13.1 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    148839    print    DATABASE     i   CREATE DATABASE print WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE print;
                postgres    false            �            1259    149199    application_messages    TABLE       CREATE TABLE public.application_messages (
    id integer NOT NULL,
    application_id integer,
    writer_id integer,
    platform_id integer,
    portfolio_id integer,
    gig_id integer,
    status character varying DEFAULT 'Pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT application_messages_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Accepted'::character varying, 'Rejected'::character varying])::text[])))
);
 (   DROP TABLE public.application_messages;
       public         heap    postgres    false            �            1259    149197    application_messages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.application_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.application_messages_id_seq;
       public          postgres    false    235            �           0    0    application_messages_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.application_messages_id_seq OWNED BY public.application_messages.id;
          public          postgres    false    234            �            1259    149170    applications    TABLE     #  CREATE TABLE public.applications (
    id integer NOT NULL,
    gig_id integer NOT NULL,
    writer_id integer NOT NULL,
    portfolio_id integer NOT NULL,
    status character varying DEFAULT 'Pending'::character varying NOT NULL,
    pitch text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    CONSTRAINT applications_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Accepted'::character varying, 'Rejected'::character varying])::text[])))
);
     DROP TABLE public.applications;
       public         heap    postgres    false            �            1259    149168    applications_id_seq    SEQUENCE     �   CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.applications_id_seq;
       public          postgres    false    233            �           0    0    applications_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;
          public          postgres    false    232            �            1259    149012    gig_tags    TABLE     �   CREATE TABLE public.gig_tags (
    id integer NOT NULL,
    gig_id integer NOT NULL,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.gig_tags;
       public         heap    postgres    false            �            1259    149010    gig_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.gig_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.gig_tags_id_seq;
       public          postgres    false    219            �           0    0    gig_tags_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.gig_tags_id_seq OWNED BY public.gig_tags.id;
          public          postgres    false    218            �            1259    148950    gigs    TABLE     �  CREATE TABLE public.gigs (
    id integer NOT NULL,
    platform_id integer,
    title character varying NOT NULL,
    description character varying NOT NULL,
    deadline date NOT NULL,
    compensation numeric(6,2) NOT NULL,
    is_remote boolean NOT NULL,
    word_count integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.gigs;
       public         heap    postgres    false            �            1259    148948    gigs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.gigs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.gigs_id_seq;
       public          postgres    false    213            �           0    0    gigs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.gigs_id_seq OWNED BY public.gigs.id;
          public          postgres    false    212            �            1259    149146    ongoing_gigs    TABLE     �   CREATE TABLE public.ongoing_gigs (
    id integer NOT NULL,
    gig_id integer,
    writer_id integer,
    platform_id integer,
    deadline date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.ongoing_gigs;
       public         heap    postgres    false            �            1259    149144    ongoing_gigs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ongoing_gigs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.ongoing_gigs_id_seq;
       public          postgres    false    231            �           0    0    ongoing_gigs_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.ongoing_gigs_id_seq OWNED BY public.ongoing_gigs.id;
          public          postgres    false    230            �            1259    148970    piece_portfolios    TABLE     �   CREATE TABLE public.piece_portfolios (
    id integer NOT NULL,
    piece_id integer NOT NULL,
    portfolio_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 $   DROP TABLE public.piece_portfolios;
       public         heap    postgres    false            �            1259    148968    piece_portfolios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.piece_portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.piece_portfolios_id_seq;
       public          postgres    false    215            �           0    0    piece_portfolios_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.piece_portfolios_id_seq OWNED BY public.piece_portfolios.id;
          public          postgres    false    214            �            1259    148991 
   piece_tags    TABLE     �   CREATE TABLE public.piece_tags (
    id integer NOT NULL,
    piece_id integer NOT NULL,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.piece_tags;
       public         heap    postgres    false            �            1259    148989    piece_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.piece_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.piece_tags_id_seq;
       public          postgres    false    217            �           0    0    piece_tags_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.piece_tags_id_seq OWNED BY public.piece_tags.id;
          public          postgres    false    216            �            1259    148932    pieces    TABLE     !  CREATE TABLE public.pieces (
    id integer NOT NULL,
    writer_id integer,
    title character varying NOT NULL,
    text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    pinned boolean DEFAULT false
);
    DROP TABLE public.pieces;
       public         heap    postgres    false            �            1259    148930    pieces_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pieces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.pieces_id_seq;
       public          postgres    false    211            �           0    0    pieces_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.pieces_id_seq OWNED BY public.pieces.id;
          public          postgres    false    210            �            1259    149033    platform_tag_follows    TABLE     �   CREATE TABLE public.platform_tag_follows (
    id integer NOT NULL,
    platform_id integer,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 (   DROP TABLE public.platform_tag_follows;
       public         heap    postgres    false            �            1259    149031    platform_tag_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.platform_tag_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.platform_tag_follows_id_seq;
       public          postgres    false    221            �           0    0    platform_tag_follows_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.platform_tag_follows_id_seq OWNED BY public.platform_tag_follows.id;
          public          postgres    false    220            �            1259    149054    platform_writer_follows    TABLE     �   CREATE TABLE public.platform_writer_follows (
    id integer NOT NULL,
    platform_id integer,
    writer_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 +   DROP TABLE public.platform_writer_follows;
       public         heap    postgres    false            �            1259    149052    platform_writer_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.platform_writer_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.platform_writer_follows_id_seq;
       public          postgres    false    223            �           0    0    platform_writer_follows_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.platform_writer_follows_id_seq OWNED BY public.platform_writer_follows.id;
          public          postgres    false    222            �            1259    148874 	   platforms    TABLE       CREATE TABLE public.platforms (
    id integer NOT NULL,
    display_name character varying NOT NULL,
    description character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.platforms;
       public         heap    postgres    false            �            1259    148872    platforms_id_seq    SEQUENCE     �   CREATE SEQUENCE public.platforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.platforms_id_seq;
       public          postgres    false    205            �           0    0    platforms_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.platforms_id_seq OWNED BY public.platforms.id;
          public          postgres    false    204            �            1259    148915 
   portfolios    TABLE     �   CREATE TABLE public.portfolios (
    id integer NOT NULL,
    writer_id integer,
    title character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.portfolios;
       public         heap    postgres    false            �            1259    148913    portfolios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.portfolios_id_seq;
       public          postgres    false    209            �           0    0    portfolios_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.portfolios_id_seq OWNED BY public.portfolios.id;
          public          postgres    false    208            �            1259    149117    queries    TABLE     �   CREATE TABLE public.queries (
    id integer NOT NULL,
    writer_id integer,
    platform_id integer,
    gig_id integer NOT NULL,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.queries;
       public         heap    postgres    false            �            1259    149115    queries_id_seq    SEQUENCE     �   CREATE SEQUENCE public.queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.queries_id_seq;
       public          postgres    false    229            �           0    0    queries_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.queries_id_seq OWNED BY public.queries.id;
          public          postgres    false    228            �            1259    148842    tags    TABLE     �   CREATE TABLE public.tags (
    id integer NOT NULL,
    title character varying NOT NULL,
    is_fiction boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.tags;
       public         heap    postgres    false            �            1259    148840    tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tags_id_seq;
       public          postgres    false    201            �           0    0    tags_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;
          public          postgres    false    200            �            1259    148888    users    TABLE     X  CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    writer_id integer,
    platform_id integer,
    password character varying NOT NULL,
    image_url character varying NOT NULL,
    address_1 character varying NOT NULL,
    address_2 character varying,
    city character varying NOT NULL,
    state character varying(2) NOT NULL,
    postal_code integer NOT NULL,
    phone text,
    twitter_username character varying,
    facebook_username character varying,
    youtube_username character varying,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    last_login_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_check CHECK (("position"((email)::text, '@'::text) > 1))
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    148886    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    207            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    206            �            1259    149075    writer_platform_follows    TABLE     �   CREATE TABLE public.writer_platform_follows (
    id integer NOT NULL,
    writer_id integer,
    platform_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 +   DROP TABLE public.writer_platform_follows;
       public         heap    postgres    false            �            1259    149073    writer_platform_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.writer_platform_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.writer_platform_follows_id_seq;
       public          postgres    false    225            �           0    0    writer_platform_follows_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.writer_platform_follows_id_seq OWNED BY public.writer_platform_follows.id;
          public          postgres    false    224            �            1259    149096    writer_tag_follows    TABLE     �   CREATE TABLE public.writer_tag_follows (
    id integer NOT NULL,
    writer_id integer,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 &   DROP TABLE public.writer_tag_follows;
       public         heap    postgres    false            �            1259    149094    writer_tag_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.writer_tag_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.writer_tag_follows_id_seq;
       public          postgres    false    227            �           0    0    writer_tag_follows_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.writer_tag_follows_id_seq OWNED BY public.writer_tag_follows.id;
          public          postgres    false    226            �            1259    148856    writers    TABLE     �  CREATE TABLE public.writers (
    id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    age integer NOT NULL,
    bio character varying NOT NULL,
    expertise_1 integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    CONSTRAINT writers_age_check CHECK ((age > 0))
);
    DROP TABLE public.writers;
       public         heap    postgres    false            �            1259    148854    writers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.writers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.writers_id_seq;
       public          postgres    false    203            �           0    0    writers_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.writers_id_seq OWNED BY public.writers.id;
          public          postgres    false    202            �           2604    149202    application_messages id    DEFAULT     �   ALTER TABLE ONLY public.application_messages ALTER COLUMN id SET DEFAULT nextval('public.application_messages_id_seq'::regclass);
 F   ALTER TABLE public.application_messages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    235    235            �           2604    149173    applications id    DEFAULT     r   ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);
 >   ALTER TABLE public.applications ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232    233            �           2604    149015    gig_tags id    DEFAULT     j   ALTER TABLE ONLY public.gig_tags ALTER COLUMN id SET DEFAULT nextval('public.gig_tags_id_seq'::regclass);
 :   ALTER TABLE public.gig_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    148953    gigs id    DEFAULT     b   ALTER TABLE ONLY public.gigs ALTER COLUMN id SET DEFAULT nextval('public.gigs_id_seq'::regclass);
 6   ALTER TABLE public.gigs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    212    213            �           2604    149149    ongoing_gigs id    DEFAULT     r   ALTER TABLE ONLY public.ongoing_gigs ALTER COLUMN id SET DEFAULT nextval('public.ongoing_gigs_id_seq'::regclass);
 >   ALTER TABLE public.ongoing_gigs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231            �           2604    148973    piece_portfolios id    DEFAULT     z   ALTER TABLE ONLY public.piece_portfolios ALTER COLUMN id SET DEFAULT nextval('public.piece_portfolios_id_seq'::regclass);
 B   ALTER TABLE public.piece_portfolios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215            �           2604    148994    piece_tags id    DEFAULT     n   ALTER TABLE ONLY public.piece_tags ALTER COLUMN id SET DEFAULT nextval('public.piece_tags_id_seq'::regclass);
 <   ALTER TABLE public.piece_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            �           2604    148935 	   pieces id    DEFAULT     f   ALTER TABLE ONLY public.pieces ALTER COLUMN id SET DEFAULT nextval('public.pieces_id_seq'::regclass);
 8   ALTER TABLE public.pieces ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    211    211            �           2604    149036    platform_tag_follows id    DEFAULT     �   ALTER TABLE ONLY public.platform_tag_follows ALTER COLUMN id SET DEFAULT nextval('public.platform_tag_follows_id_seq'::regclass);
 F   ALTER TABLE public.platform_tag_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    149057    platform_writer_follows id    DEFAULT     �   ALTER TABLE ONLY public.platform_writer_follows ALTER COLUMN id SET DEFAULT nextval('public.platform_writer_follows_id_seq'::regclass);
 I   ALTER TABLE public.platform_writer_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    148877    platforms id    DEFAULT     l   ALTER TABLE ONLY public.platforms ALTER COLUMN id SET DEFAULT nextval('public.platforms_id_seq'::regclass);
 ;   ALTER TABLE public.platforms ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    204    205    205            �           2604    148918    portfolios id    DEFAULT     n   ALTER TABLE ONLY public.portfolios ALTER COLUMN id SET DEFAULT nextval('public.portfolios_id_seq'::regclass);
 <   ALTER TABLE public.portfolios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    209    209            �           2604    149120 
   queries id    DEFAULT     h   ALTER TABLE ONLY public.queries ALTER COLUMN id SET DEFAULT nextval('public.queries_id_seq'::regclass);
 9   ALTER TABLE public.queries ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228    229            �           2604    148845    tags id    DEFAULT     b   ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
 6   ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    201    200    201            �           2604    148891    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206    207            �           2604    149078    writer_platform_follows id    DEFAULT     �   ALTER TABLE ONLY public.writer_platform_follows ALTER COLUMN id SET DEFAULT nextval('public.writer_platform_follows_id_seq'::regclass);
 I   ALTER TABLE public.writer_platform_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224    225            �           2604    149099    writer_tag_follows id    DEFAULT     ~   ALTER TABLE ONLY public.writer_tag_follows ALTER COLUMN id SET DEFAULT nextval('public.writer_tag_follows_id_seq'::regclass);
 D   ALTER TABLE public.writer_tag_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226    227            �           2604    148859 
   writers id    DEFAULT     h   ALTER TABLE ONLY public.writers ALTER COLUMN id SET DEFAULT nextval('public.writers_id_seq'::regclass);
 9   ALTER TABLE public.writers ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            �          0    149199    application_messages 
   TABLE DATA           �   COPY public.application_messages (id, application_id, writer_id, platform_id, portfolio_id, gig_id, status, created_at) FROM stdin;
    public          postgres    false    235   I�       �          0    149170    applications 
   TABLE DATA           r   COPY public.applications (id, gig_id, writer_id, portfolio_id, status, pitch, created_at, updated_at) FROM stdin;
    public          postgres    false    233   f�       �          0    149012    gig_tags 
   TABLE DATA           N   COPY public.gig_tags (id, gig_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    219   ��       �          0    148950    gigs 
   TABLE DATA           �   COPY public.gigs (id, platform_id, title, description, deadline, compensation, is_remote, word_count, is_active, created_at, updated_at) FROM stdin;
    public          postgres    false    213   ��       �          0    149146    ongoing_gigs 
   TABLE DATA           `   COPY public.ongoing_gigs (id, gig_id, writer_id, platform_id, deadline, created_at) FROM stdin;
    public          postgres    false    231   $�       �          0    148970    piece_portfolios 
   TABLE DATA           ^   COPY public.piece_portfolios (id, piece_id, portfolio_id, created_at, updated_at) FROM stdin;
    public          postgres    false    215   g�       �          0    148991 
   piece_tags 
   TABLE DATA           R   COPY public.piece_tags (id, piece_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    217   �       �          0    148932    pieces 
   TABLE DATA           \   COPY public.pieces (id, writer_id, title, text, created_at, updated_at, pinned) FROM stdin;
    public          postgres    false    211   ��       �          0    149033    platform_tag_follows 
   TABLE DATA           _   COPY public.platform_tag_follows (id, platform_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    221   ��       �          0    149054    platform_writer_follows 
   TABLE DATA           e   COPY public.platform_writer_follows (id, platform_id, writer_id, created_at, updated_at) FROM stdin;
    public          postgres    false    223   &�       �          0    148874 	   platforms 
   TABLE DATA           Z   COPY public.platforms (id, display_name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    205   ��       �          0    148915 
   portfolios 
   TABLE DATA           R   COPY public.portfolios (id, writer_id, title, created_at, updated_at) FROM stdin;
    public          postgres    false    209   O�       �          0    149117    queries 
   TABLE DATA           Z   COPY public.queries (id, writer_id, platform_id, gig_id, message, created_at) FROM stdin;
    public          postgres    false    229   (�       �          0    148842    tags 
   TABLE DATA           M   COPY public.tags (id, title, is_fiction, created_at, updated_at) FROM stdin;
    public          postgres    false    201   E�       �          0    148888    users 
   TABLE DATA           �   COPY public.users (id, email, writer_id, platform_id, password, image_url, address_1, address_2, city, state, postal_code, phone, twitter_username, facebook_username, youtube_username, is_admin, created_at, updated_at, last_login_at) FROM stdin;
    public          postgres    false    207   6�       �          0    149075    writer_platform_follows 
   TABLE DATA           e   COPY public.writer_platform_follows (id, writer_id, platform_id, created_at, updated_at) FROM stdin;
    public          postgres    false    225   F�       �          0    149096    writer_tag_follows 
   TABLE DATA           [   COPY public.writer_tag_follows (id, writer_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    227   ��       �          0    148856    writers 
   TABLE DATA           k   COPY public.writers (id, first_name, last_name, age, bio, expertise_1, created_at, updated_at) FROM stdin;
    public          postgres    false    203   �       �           0    0    application_messages_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.application_messages_id_seq', 1, true);
          public          postgres    false    234            �           0    0    applications_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.applications_id_seq', 12, true);
          public          postgres    false    232            �           0    0    gig_tags_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.gig_tags_id_seq', 26, true);
          public          postgres    false    218            �           0    0    gigs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.gigs_id_seq', 12, true);
          public          postgres    false    212            �           0    0    ongoing_gigs_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.ongoing_gigs_id_seq', 1, true);
          public          postgres    false    230            �           0    0    piece_portfolios_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.piece_portfolios_id_seq', 23, true);
          public          postgres    false    214            �           0    0    piece_tags_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.piece_tags_id_seq', 25, true);
          public          postgres    false    216            �           0    0    pieces_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.pieces_id_seq', 21, true);
          public          postgres    false    210            �           0    0    platform_tag_follows_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.platform_tag_follows_id_seq', 15, true);
          public          postgres    false    220            �           0    0    platform_writer_follows_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.platform_writer_follows_id_seq', 10, true);
          public          postgres    false    222            �           0    0    platforms_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.platforms_id_seq', 5, true);
          public          postgres    false    204            �           0    0    portfolios_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.portfolios_id_seq', 13, true);
          public          postgres    false    208            �           0    0    queries_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.queries_id_seq', 1, false);
          public          postgres    false    228            �           0    0    tags_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.tags_id_seq', 20, true);
          public          postgres    false    200            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 10, true);
          public          postgres    false    206            �           0    0    writer_platform_follows_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.writer_platform_follows_id_seq', 9, true);
          public          postgres    false    224            �           0    0    writer_tag_follows_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.writer_tag_follows_id_seq', 7, true);
          public          postgres    false    226            �           0    0    writers_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.writers_id_seq', 5, true);
          public          postgres    false    202            �           2606    149210 .   application_messages application_messages_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_pkey;
       public            postgres    false    235            �           2606    149181    applications applications_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_pkey;
       public            postgres    false    233            �           2606    149020 #   gig_tags gig_tags_gig_id_tag_id_key 
   CONSTRAINT     h   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_gig_id_tag_id_key UNIQUE (gig_id, tag_id);
 M   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_gig_id_tag_id_key;
       public            postgres    false    219    219            �           2606    149018    gig_tags gig_tags_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_pkey;
       public            postgres    false    219            �           2606    148960    gigs gigs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.gigs
    ADD CONSTRAINT gigs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.gigs DROP CONSTRAINT gigs_pkey;
       public            postgres    false    213            �           2606    148962    gigs gigs_platform_id_title_key 
   CONSTRAINT     h   ALTER TABLE ONLY public.gigs
    ADD CONSTRAINT gigs_platform_id_title_key UNIQUE (platform_id, title);
 I   ALTER TABLE ONLY public.gigs DROP CONSTRAINT gigs_platform_id_title_key;
       public            postgres    false    213    213            �           2606    149152    ongoing_gigs ongoing_gigs_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_pkey;
       public            postgres    false    231            �           2606    148978 ;   piece_portfolios piece_portfolios_piece_id_portfolio_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_piece_id_portfolio_id_key UNIQUE (piece_id, portfolio_id);
 e   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_piece_id_portfolio_id_key;
       public            postgres    false    215    215            �           2606    148976 &   piece_portfolios piece_portfolios_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_pkey;
       public            postgres    false    215            �           2606    148999 )   piece_tags piece_tags_piece_id_tag_id_key 
   CONSTRAINT     p   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_piece_id_tag_id_key UNIQUE (piece_id, tag_id);
 S   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_piece_id_tag_id_key;
       public            postgres    false    217    217            �           2606    148997    piece_tags piece_tags_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_pkey;
       public            postgres    false    217            �           2606    148942    pieces pieces_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.pieces
    ADD CONSTRAINT pieces_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.pieces DROP CONSTRAINT pieces_pkey;
       public            postgres    false    211            �           2606    149039 .   platform_tag_follows platform_tag_follows_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_pkey;
       public            postgres    false    221            �           2606    149041 @   platform_tag_follows platform_tag_follows_platform_id_tag_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_platform_id_tag_id_key UNIQUE (platform_id, tag_id);
 j   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_platform_id_tag_id_key;
       public            postgres    false    221    221            �           2606    149060 4   platform_writer_follows platform_writer_follows_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_pkey;
       public            postgres    false    223            �           2606    149062 I   platform_writer_follows platform_writer_follows_platform_id_writer_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_platform_id_writer_id_key UNIQUE (platform_id, writer_id);
 s   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_platform_id_writer_id_key;
       public            postgres    false    223    223            �           2606    148885 $   platforms platforms_display_name_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_display_name_key UNIQUE (display_name);
 N   ALTER TABLE ONLY public.platforms DROP CONSTRAINT platforms_display_name_key;
       public            postgres    false    205            �           2606    148883    platforms platforms_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.platforms DROP CONSTRAINT platforms_pkey;
       public            postgres    false    205            �           2606    148924    portfolios portfolios_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.portfolios DROP CONSTRAINT portfolios_pkey;
       public            postgres    false    209            �           2606    149126    queries queries_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_pkey;
       public            postgres    false    229            �           2606    149128 0   queries queries_writer_id_platform_id_gig_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_writer_id_platform_id_gig_id_key UNIQUE (writer_id, platform_id, gig_id);
 Z   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_writer_id_platform_id_gig_id_key;
       public            postgres    false    229    229    229            �           2606    148851    tags tags_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
       public            postgres    false    201            �           2606    148853    tags tags_title_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_title_key UNIQUE (title);
 =   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_title_key;
       public            postgres    false    201            �           2606    148902    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    207            �           2606    148900    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    207            �           2606    149081 4   writer_platform_follows writer_platform_follows_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_pkey;
       public            postgres    false    225            �           2606    149083 I   writer_platform_follows writer_platform_follows_writer_id_platform_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_writer_id_platform_id_key UNIQUE (writer_id, platform_id);
 s   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_writer_id_platform_id_key;
       public            postgres    false    225    225            �           2606    149102 *   writer_tag_follows writer_tag_follows_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_pkey;
       public            postgres    false    227            �           2606    149104 :   writer_tag_follows writer_tag_follows_writer_id_tag_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_writer_id_tag_id_key UNIQUE (writer_id, tag_id);
 d   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_writer_id_tag_id_key;
       public            postgres    false    227    227            �           2606    148866    writers writers_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.writers
    ADD CONSTRAINT writers_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.writers DROP CONSTRAINT writers_pkey;
       public            postgres    false    203                       2606    149211 =   application_messages application_messages_application_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;
 g   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_application_id_fkey;
       public          postgres    false    235    3065    233                       2606    149231 5   application_messages application_messages_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_gig_id_fkey;
       public          postgres    false    3027    235    213                       2606    149221 :   application_messages application_messages_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_platform_id_fkey;
       public          postgres    false    235    205    3017                       2606    149226 ;   application_messages application_messages_portfolio_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;
 e   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_portfolio_id_fkey;
       public          postgres    false    3023    235    209                       2606    149216 8   application_messages application_messages_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_writer_id_fkey;
       public          postgres    false    203    235    3013                       2606    149182 %   applications applications_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_gig_id_fkey;
       public          postgres    false    233    3027    213                       2606    149192 +   applications applications_portfolio_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_portfolio_id_fkey;
       public          postgres    false    209    233    3023                       2606    149187 (   applications applications_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_writer_id_fkey;
       public          postgres    false    3013    203    233                       2606    149021    gig_tags gig_tags_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_gig_id_fkey;
       public          postgres    false    219    213    3027                       2606    149026    gig_tags gig_tags_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_tag_id_fkey;
       public          postgres    false    201    3009    219                       2606    148963    gigs gigs_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.gigs
    ADD CONSTRAINT gigs_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.gigs DROP CONSTRAINT gigs_platform_id_fkey;
       public          postgres    false    205    3017    213                       2606    149153 %   ongoing_gigs ongoing_gigs_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_gig_id_fkey;
       public          postgres    false    213    231    3027                       2606    149163 *   ongoing_gigs ongoing_gigs_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_platform_id_fkey;
       public          postgres    false    231    205    3017                       2606    149158 (   ongoing_gigs ongoing_gigs_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_writer_id_fkey;
       public          postgres    false    231    203    3013                       2606    148979 /   piece_portfolios piece_portfolios_piece_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_piece_id_fkey FOREIGN KEY (piece_id) REFERENCES public.pieces(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_piece_id_fkey;
       public          postgres    false    211    215    3025                       2606    148984 3   piece_portfolios piece_portfolios_portfolio_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_portfolio_id_fkey;
       public          postgres    false    209    215    3023                       2606    149000 #   piece_tags piece_tags_piece_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_piece_id_fkey FOREIGN KEY (piece_id) REFERENCES public.pieces(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_piece_id_fkey;
       public          postgres    false    211    3025    217                       2606    149005 !   piece_tags piece_tags_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_tag_id_fkey;
       public          postgres    false    201    3009    217                        2606    148943    pieces pieces_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pieces
    ADD CONSTRAINT pieces_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.pieces DROP CONSTRAINT pieces_writer_id_fkey;
       public          postgres    false    203    3013    211                       2606    149042 :   platform_tag_follows platform_tag_follows_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_platform_id_fkey;
       public          postgres    false    3017    221    205            	           2606    149047 5   platform_tag_follows platform_tag_follows_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_tag_id_fkey;
       public          postgres    false    3009    201    221            
           2606    149063 @   platform_writer_follows platform_writer_follows_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_platform_id_fkey;
       public          postgres    false    3017    223    205                       2606    149068 >   platform_writer_follows platform_writer_follows_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_writer_id_fkey;
       public          postgres    false    203    223    3013            �           2606    148925 $   portfolios portfolios_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.portfolios DROP CONSTRAINT portfolios_writer_id_fkey;
       public          postgres    false    3013    209    203                       2606    149139    queries queries_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_gig_id_fkey;
       public          postgres    false    3027    229    213                       2606    149134     queries queries_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_platform_id_fkey;
       public          postgres    false    3017    205    229                       2606    149129    queries queries_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_writer_id_fkey;
       public          postgres    false    203    229    3013            �           2606    148908    users users_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT users_platform_id_fkey;
       public          postgres    false    205    207    3017            �           2606    148903    users users_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.users DROP CONSTRAINT users_writer_id_fkey;
       public          postgres    false    203    207    3013                       2606    149089 @   writer_platform_follows writer_platform_follows_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_platform_id_fkey;
       public          postgres    false    225    3017    205                       2606    149084 >   writer_platform_follows writer_platform_follows_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_writer_id_fkey;
       public          postgres    false    3013    225    203                       2606    149110 1   writer_tag_follows writer_tag_follows_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_tag_id_fkey;
       public          postgres    false    3009    227    201                       2606    149105 4   writer_tag_follows writer_tag_follows_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_writer_id_fkey;
       public          postgres    false    227    3013    203            �           2606    148867     writers writers_expertise_1_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writers
    ADD CONSTRAINT writers_expertise_1_fkey FOREIGN KEY (expertise_1) REFERENCES public.tags(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.writers DROP CONSTRAINT writers_expertise_1_fkey;
       public          postgres    false    3009    203    201            �      x������ � �      �   �   x���;�@�z��@"{���!H	B4��Z�X.=OcY�>��y>����*�j_4ڰ����m��wh@���U��eP=LG�AC����}�e���>!���'(���m�]U�Mql)�5�r�      �   �   x���ˍ1�3�$0_:��`�c1����'(�" 0`dz��)^�7�-:&�#����4�1���4��M���C� ߈��E���E��˔�W^�Aޯ�D�:KԮ�����g:]�|pL�(��������}��˪���!~�pd�R��@��_7�M>��):�Vl�$f)�^��i��(�Yv`1X糲JzV��ȹQ|#��n��3������A      �   ,  x��YO�@���_1?�X>�7H[�ZPU�x�eYO����(���I8Ԋ�g�R${�����l�(�N�CsO� ~�I*��v@��T��,9��ZY��7 *��JR5 /> �/ $o;]�î�Ť$UTy��;h��t[���� �ҝ1�r��:���{n�� �<YP�:�+�G4��p�����[�aY
�6"��ɀ���&�u�U�>��;2�-��J
�Tv�;�u�{V�l{
h-���}�;�a�kT0za��M�%�}#�@K)P�<�{��+؋�h�P�(�H�R��^�A����@�M�t�!@�᰻��.��$K��|�Fe'I�k�#�4]@Z,�|��,��<��|�1W�/2��[�A(�u�9�+�s�[�݈�P�H��G�(�,Z�a�k.�0up�'�h�F2�B��-��(�<�B8G��.�����C"�����ߌ��i>nFN������4�(� �&}1&��+�#ÕG˝��悭FcGJ�BI�l�(�l/#�xI&G�x�:��I�#�s�`�(�|K�G�8d(NU��tp��t����W� NÙ�E8Ѿ� �?����7%�1�ڈ�ኃ�؝8��%��+����Y+Y�eeQ�{YI� �(��S[�j��;;�10�k�y�������n������ÿ�4��Tǯ2��+��w����6Kr>��*��tvX,g��G���իJ�Ԋ��%ھ7ܭ�A����"2��5$K Y,�d�q��I��P���(��I�v�����>$I�{b0{"{�esk�����u<�L� c��4      �   3   x�3�4�4A#C]s]#(�X��@��������B�����ؐ+F��� ��      �   �   x����!г�"�j>��"R��_G�)�����	�e��^��K�2_^�.�c�y����TgSQ�:�����Λ�f`�fb�	DjT��L�h��6�=Q&U��T��&25��jbG2�I׹�����6a���w�&/������u�Э����Uk޷z�R��U�      �   �   x�����0�3����@��C�	���{]%�'�@��԰��X�2�<����J�i����zM"f�`�f�A�)!'1+�"*�����Rlp���ͪ����T05sW���$���S�}N}:2�*I���,���}0�2�eԬ���}�H      �   �  x��۱n�0 �Y�����8I��m��)�8E/W�dJ�
E&A���8����`��D��h���TM�ڳ�I���OC���z�aL=��� #G����F2�b
�-<v; �rr�V q{�B�~�����&!E��C����	z�9�|�p�#��^����{9������Cj�)��;H�bo���|��Gz��%�^b�d�8���KL��C�H���@C��ԃ�$.�{��$�h	[��B�P�.�#�� �	|z44DJ��Ro���L�Ř[HC�ܒ�U̕�AM���wFhi������00���K]S?�f�Ys<�7��,������r��.���[�x_���s��sq��=J�(3��Իh�E5�V�?8���u���[W"�d�o���٭+r־?�S=�S=�S=�������8��Ɔ�ud[�V��=���K'����z��z��z��z��P��e^��.��AK�.W�?��22��RL�3�^�H+t��]}��t� ���E[Ǻ�V�jM\��VR��=�*�Q�K�����T#9��b��=�k���v�QO*�{.�0Ș׾�骭x�E��V�>�]�C|�J^6���o���l�P���Gk�ﮅd~�z��/��۩��P�M���_����Q�(�[&�yuR��[�L�����E�ϦB~��B��fn�9�|_��[.eko'u]�Ш��      �   p   x���A� �7��rwЂ�*�������� �ǚ�4/�b�/�:�����"�q�.L�axG�zl�݉2���T�yP� d���TȈT:��r��*8DͲk����d�      �   ]   x����� D�3T�t\@�XD*��:���7�� AΚ�4/x/�4�u`�U֧���b{G��t	�3���{�qb^�Eg���=hUU��A�      �   �  x��Mn1���S� � ;@�m�EhZ�@6�D�D$Q�D7�}��]w]gv��������g	��a�{�Q�;)�s�^��� #�%8I�\���s��8�L`	��5 ��(�l͜{��h��O&�N��	�(��%�����ю��\!ImE=�+�K���r/��}�oI�V��x���d�F��wI�F�Em��WNP(:P�T̸�8J�l���1�@�8�oBfHa�{��/������Qn�=F�@�CrV�4���;�E.RO�'eC����7�nǎ<U*�6J�k`�-��'W��0]L���f�����f��l�����t�������#�'92ͬ�k�0ӛ���fz3������7�f��R��wѦO�����s�з���H�<wl3��'~9�rmR~��|�6�>c֏�b�����      �   �   x��ѿ�0����� ��
�g5!Nƨ���ؚR���C���7�_	���O5#S�2�:��a��<� �\�e/8ȃ���}�J`hc^��/��yЧ�s�t�m�ũU|2�7零&B�@[k����� [����A��ҏ��?��)㣔�����u��@�w�B~>mk����gY���eV`�!��D��$I��dB�7m�      �      x������ � �      �   �   x���1��0Ekq
_��!	9DN��14�����~I�Z�O�4_<��f0��mg[=*�?�}��2�������h1%x̡�d�"2z���?qd�+S���/\��AE>����6�=��a�1Yw�e�LA�5$�*�"/�����e�\5;���=T��r� �Kg:���v�Do�'�o߳��	�ٕ��)���p�i���;nF�e�ץi�8��Y      �      x�͖]o�<ǯ�O�^=`��r��e}ѶJK��y��pj;ɺO?C�=�^�i��H�0���? Z*�q�X�b�A�>�EGlvD��俋�F�V�e}s�ϫ��ZC=�L�iv��l>��^^��{?����ɵ�h��ʍ��)Um�[U˶�O���lWQaZ�ZN��,]���'[���Qt[E�E4g$^�*D�W�Nᩏ�$��z+�wJ��K����"4�Nڳq�a4"Ŕ����"Ϲ�e���#S�ZU㪑��I�%5d�S��u��|�.`i�AD��^���J������1�����\�w�Px�Qh��1搢��.de��k�
��8J,
��J)Z�:hغq����ꨛ�e���W���U�uӣj��$#�$��+{q:;+����y{���x�}�TT�x���.��\_;�u ����h�B�C# �z��'���FZ-��K��O�l��А���_|׽�\ Nyyڑ������w��2�0�;��0�}��߭;`xj��כ�K�F6+�^��JM����<{��Ux�UƔ�c��C܃� �F:�?�I�i%��|�&�b'����P(A�����ػz�H��>��W��9W���ޤ����G�D���ZZ���N=�"v�^4#�۵�ݫ/޽��¯L	��R @�4�#���24F0�G,q�a��E��s5f����}���ZX�+��xoZ|h?�S�̈�쟍��p�?�Fd8�3F	c��`0��f�      �   U   x���[� D��DE��P���hb�;�{f��Ĵ��fE�#�նy2��tk
`��89���7��f��yC0+�s+3ad;�      �   P   x����� ��3E �$��!����hX �ߓm�PhS�f��O�i^;��%�91�������鸴tx$%_|���UD~�-(      �   �  x���n�0Eך��$Flϴpvi�(�]6�ę!�W����Ku���K��E�{φ�7L��������9���lH�� :*W��Ϥ�� GΚ�Ȳf2r�kv�@!�2{͆M�j�/���[8<x��Vq��ȳ���=����U��C.��wJ����t8wnE��M�Ӓ��w�)�Ȩ2�}k��p����=$����%1.N��(�H�S��	4[�/!1Ta_�|��*)��)�-F� h���N��K�!.b
lȷ[R2TW����߳fC�R;u�6�b�#�͵�A�j�����z\`��N���vˇ�ˢ��o&�((��Al�<u�k���tz�^���uz���,��Y=�|��(Y�0���꬚�x	�V=Y>QR_(9dOjב�����d���K���+����캡_b�<l6��
�     