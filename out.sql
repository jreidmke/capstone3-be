PGDMP     	    '                y           print    13.1    13.1 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    140447    print    DATABASE     i   CREATE DATABASE print WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE print;
                postgres    false            �            1259    140812    application_messages    TABLE       CREATE TABLE public.application_messages (
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
       public         heap    postgres    false            �            1259    140810    application_messages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.application_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.application_messages_id_seq;
       public          postgres    false    235            �           0    0    application_messages_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.application_messages_id_seq OWNED BY public.application_messages.id;
          public          postgres    false    234            �            1259    140783    applications    TABLE     #  CREATE TABLE public.applications (
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
       public         heap    postgres    false            �            1259    140781    applications_id_seq    SEQUENCE     �   CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.applications_id_seq;
       public          postgres    false    233            �           0    0    applications_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;
          public          postgres    false    232            �            1259    140625    gig_tags    TABLE     �   CREATE TABLE public.gig_tags (
    id integer NOT NULL,
    gig_id integer NOT NULL,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.gig_tags;
       public         heap    postgres    false            �            1259    140623    gig_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.gig_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.gig_tags_id_seq;
       public          postgres    false    219            �           0    0    gig_tags_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.gig_tags_id_seq OWNED BY public.gig_tags.id;
          public          postgres    false    218            �            1259    140563    gigs    TABLE     �  CREATE TABLE public.gigs (
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
       public         heap    postgres    false            �            1259    140561    gigs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.gigs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.gigs_id_seq;
       public          postgres    false    213            �           0    0    gigs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.gigs_id_seq OWNED BY public.gigs.id;
          public          postgres    false    212            �            1259    140759    ongoing_gigs    TABLE     �   CREATE TABLE public.ongoing_gigs (
    id integer NOT NULL,
    gig_id integer,
    writer_id integer,
    platform_id integer,
    deadline date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.ongoing_gigs;
       public         heap    postgres    false            �            1259    140757    ongoing_gigs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ongoing_gigs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.ongoing_gigs_id_seq;
       public          postgres    false    231            �           0    0    ongoing_gigs_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.ongoing_gigs_id_seq OWNED BY public.ongoing_gigs.id;
          public          postgres    false    230            �            1259    140583    piece_portfolios    TABLE     �   CREATE TABLE public.piece_portfolios (
    id integer NOT NULL,
    piece_id integer NOT NULL,
    portfolio_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 $   DROP TABLE public.piece_portfolios;
       public         heap    postgres    false            �            1259    140581    piece_portfolios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.piece_portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.piece_portfolios_id_seq;
       public          postgres    false    215            �           0    0    piece_portfolios_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.piece_portfolios_id_seq OWNED BY public.piece_portfolios.id;
          public          postgres    false    214            �            1259    140604 
   piece_tags    TABLE     �   CREATE TABLE public.piece_tags (
    id integer NOT NULL,
    piece_id integer NOT NULL,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.piece_tags;
       public         heap    postgres    false            �            1259    140602    piece_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.piece_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.piece_tags_id_seq;
       public          postgres    false    217            �           0    0    piece_tags_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.piece_tags_id_seq OWNED BY public.piece_tags.id;
          public          postgres    false    216            �            1259    140545    pieces    TABLE     !  CREATE TABLE public.pieces (
    id integer NOT NULL,
    writer_id integer,
    title character varying NOT NULL,
    text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    pinned boolean DEFAULT false
);
    DROP TABLE public.pieces;
       public         heap    postgres    false            �            1259    140543    pieces_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pieces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.pieces_id_seq;
       public          postgres    false    211            �           0    0    pieces_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.pieces_id_seq OWNED BY public.pieces.id;
          public          postgres    false    210            �            1259    140646    platform_tag_follows    TABLE     �   CREATE TABLE public.platform_tag_follows (
    id integer NOT NULL,
    platform_id integer,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 (   DROP TABLE public.platform_tag_follows;
       public         heap    postgres    false            �            1259    140644    platform_tag_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.platform_tag_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.platform_tag_follows_id_seq;
       public          postgres    false    221            �           0    0    platform_tag_follows_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.platform_tag_follows_id_seq OWNED BY public.platform_tag_follows.id;
          public          postgres    false    220            �            1259    140667    platform_writer_follows    TABLE     �   CREATE TABLE public.platform_writer_follows (
    id integer NOT NULL,
    platform_id integer,
    writer_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 +   DROP TABLE public.platform_writer_follows;
       public         heap    postgres    false            �            1259    140665    platform_writer_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.platform_writer_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.platform_writer_follows_id_seq;
       public          postgres    false    223            �           0    0    platform_writer_follows_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.platform_writer_follows_id_seq OWNED BY public.platform_writer_follows.id;
          public          postgres    false    222            �            1259    140487 	   platforms    TABLE       CREATE TABLE public.platforms (
    id integer NOT NULL,
    display_name character varying NOT NULL,
    description character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.platforms;
       public         heap    postgres    false            �            1259    140485    platforms_id_seq    SEQUENCE     �   CREATE SEQUENCE public.platforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.platforms_id_seq;
       public          postgres    false    205            �           0    0    platforms_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.platforms_id_seq OWNED BY public.platforms.id;
          public          postgres    false    204            �            1259    140528 
   portfolios    TABLE     �   CREATE TABLE public.portfolios (
    id integer NOT NULL,
    writer_id integer,
    title character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.portfolios;
       public         heap    postgres    false            �            1259    140526    portfolios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.portfolios_id_seq;
       public          postgres    false    209            �           0    0    portfolios_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.portfolios_id_seq OWNED BY public.portfolios.id;
          public          postgres    false    208            �            1259    140730    queries    TABLE     �   CREATE TABLE public.queries (
    id integer NOT NULL,
    writer_id integer,
    platform_id integer,
    gig_id integer NOT NULL,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.queries;
       public         heap    postgres    false            �            1259    140728    queries_id_seq    SEQUENCE     �   CREATE SEQUENCE public.queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.queries_id_seq;
       public          postgres    false    229            �           0    0    queries_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.queries_id_seq OWNED BY public.queries.id;
          public          postgres    false    228            �            1259    140450    tags    TABLE     �   CREATE TABLE public.tags (
    id integer NOT NULL,
    title character varying NOT NULL,
    is_fiction boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.tags;
       public         heap    postgres    false            �            1259    140448    tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tags_id_seq;
       public          postgres    false    201            �           0    0    tags_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;
          public          postgres    false    200            �            1259    140501    users    TABLE     X  CREATE TABLE public.users (
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
       public         heap    postgres    false            �            1259    140499    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    207            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    206            �            1259    140688    writer_platform_follows    TABLE     �   CREATE TABLE public.writer_platform_follows (
    id integer NOT NULL,
    writer_id integer,
    platform_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 +   DROP TABLE public.writer_platform_follows;
       public         heap    postgres    false            �            1259    140686    writer_platform_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.writer_platform_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.writer_platform_follows_id_seq;
       public          postgres    false    225            �           0    0    writer_platform_follows_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.writer_platform_follows_id_seq OWNED BY public.writer_platform_follows.id;
          public          postgres    false    224            �            1259    140709    writer_tag_follows    TABLE     �   CREATE TABLE public.writer_tag_follows (
    id integer NOT NULL,
    writer_id integer,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
 &   DROP TABLE public.writer_tag_follows;
       public         heap    postgres    false            �            1259    140707    writer_tag_follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.writer_tag_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.writer_tag_follows_id_seq;
       public          postgres    false    227            �           0    0    writer_tag_follows_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.writer_tag_follows_id_seq OWNED BY public.writer_tag_follows.id;
          public          postgres    false    226            �            1259    140464    writers    TABLE     �  CREATE TABLE public.writers (
    id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    age integer NOT NULL,
    bio character varying NOT NULL,
    expertise_1 integer NOT NULL,
    expertise_2 integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    CONSTRAINT writers_age_check CHECK ((age > 0))
);
    DROP TABLE public.writers;
       public         heap    postgres    false            �            1259    140462    writers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.writers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.writers_id_seq;
       public          postgres    false    203            �           0    0    writers_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.writers_id_seq OWNED BY public.writers.id;
          public          postgres    false    202            �           2604    140815    application_messages id    DEFAULT     �   ALTER TABLE ONLY public.application_messages ALTER COLUMN id SET DEFAULT nextval('public.application_messages_id_seq'::regclass);
 F   ALTER TABLE public.application_messages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    234    235            �           2604    140786    applications id    DEFAULT     r   ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);
 >   ALTER TABLE public.applications ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232    233            �           2604    140628    gig_tags id    DEFAULT     j   ALTER TABLE ONLY public.gig_tags ALTER COLUMN id SET DEFAULT nextval('public.gig_tags_id_seq'::regclass);
 :   ALTER TABLE public.gig_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    140566    gigs id    DEFAULT     b   ALTER TABLE ONLY public.gigs ALTER COLUMN id SET DEFAULT nextval('public.gigs_id_seq'::regclass);
 6   ALTER TABLE public.gigs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    212    213            �           2604    140762    ongoing_gigs id    DEFAULT     r   ALTER TABLE ONLY public.ongoing_gigs ALTER COLUMN id SET DEFAULT nextval('public.ongoing_gigs_id_seq'::regclass);
 >   ALTER TABLE public.ongoing_gigs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231            �           2604    140586    piece_portfolios id    DEFAULT     z   ALTER TABLE ONLY public.piece_portfolios ALTER COLUMN id SET DEFAULT nextval('public.piece_portfolios_id_seq'::regclass);
 B   ALTER TABLE public.piece_portfolios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    140607    piece_tags id    DEFAULT     n   ALTER TABLE ONLY public.piece_tags ALTER COLUMN id SET DEFAULT nextval('public.piece_tags_id_seq'::regclass);
 <   ALTER TABLE public.piece_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217            �           2604    140548 	   pieces id    DEFAULT     f   ALTER TABLE ONLY public.pieces ALTER COLUMN id SET DEFAULT nextval('public.pieces_id_seq'::regclass);
 8   ALTER TABLE public.pieces ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    211    211            �           2604    140649    platform_tag_follows id    DEFAULT     �   ALTER TABLE ONLY public.platform_tag_follows ALTER COLUMN id SET DEFAULT nextval('public.platform_tag_follows_id_seq'::regclass);
 F   ALTER TABLE public.platform_tag_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220    221            �           2604    140670    platform_writer_follows id    DEFAULT     �   ALTER TABLE ONLY public.platform_writer_follows ALTER COLUMN id SET DEFAULT nextval('public.platform_writer_follows_id_seq'::regclass);
 I   ALTER TABLE public.platform_writer_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    140490    platforms id    DEFAULT     l   ALTER TABLE ONLY public.platforms ALTER COLUMN id SET DEFAULT nextval('public.platforms_id_seq'::regclass);
 ;   ALTER TABLE public.platforms ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    204    205    205            �           2604    140531    portfolios id    DEFAULT     n   ALTER TABLE ONLY public.portfolios ALTER COLUMN id SET DEFAULT nextval('public.portfolios_id_seq'::regclass);
 <   ALTER TABLE public.portfolios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    209    209            �           2604    140733 
   queries id    DEFAULT     h   ALTER TABLE ONLY public.queries ALTER COLUMN id SET DEFAULT nextval('public.queries_id_seq'::regclass);
 9   ALTER TABLE public.queries ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    229    229            �           2604    140453    tags id    DEFAULT     b   ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
 6   ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    200    201    201            �           2604    140504    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206    207            �           2604    140691    writer_platform_follows id    DEFAULT     �   ALTER TABLE ONLY public.writer_platform_follows ALTER COLUMN id SET DEFAULT nextval('public.writer_platform_follows_id_seq'::regclass);
 I   ALTER TABLE public.writer_platform_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224    225            �           2604    140712    writer_tag_follows id    DEFAULT     ~   ALTER TABLE ONLY public.writer_tag_follows ALTER COLUMN id SET DEFAULT nextval('public.writer_tag_follows_id_seq'::regclass);
 D   ALTER TABLE public.writer_tag_follows ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226    227            �           2604    140467 
   writers id    DEFAULT     h   ALTER TABLE ONLY public.writers ALTER COLUMN id SET DEFAULT nextval('public.writers_id_seq'::regclass);
 9   ALTER TABLE public.writers ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    202    203    203            �          0    140812    application_messages 
   TABLE DATA           �   COPY public.application_messages (id, application_id, writer_id, platform_id, portfolio_id, gig_id, status, created_at) FROM stdin;
    public          postgres    false    235   ��       �          0    140783    applications 
   TABLE DATA           r   COPY public.applications (id, gig_id, writer_id, portfolio_id, status, pitch, created_at, updated_at) FROM stdin;
    public          postgres    false    233   �       �          0    140625    gig_tags 
   TABLE DATA           N   COPY public.gig_tags (id, gig_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    219   ��       �          0    140563    gigs 
   TABLE DATA           �   COPY public.gigs (id, platform_id, title, description, deadline, compensation, is_remote, word_count, is_active, created_at, updated_at) FROM stdin;
    public          postgres    false    213   �       �          0    140759    ongoing_gigs 
   TABLE DATA           `   COPY public.ongoing_gigs (id, gig_id, writer_id, platform_id, deadline, created_at) FROM stdin;
    public          postgres    false    231   ��       �          0    140583    piece_portfolios 
   TABLE DATA           ^   COPY public.piece_portfolios (id, piece_id, portfolio_id, created_at, updated_at) FROM stdin;
    public          postgres    false    215   ��       �          0    140604 
   piece_tags 
   TABLE DATA           R   COPY public.piece_tags (id, piece_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    217   ��       �          0    140545    pieces 
   TABLE DATA           \   COPY public.pieces (id, writer_id, title, text, created_at, updated_at, pinned) FROM stdin;
    public          postgres    false    211   D�       �          0    140646    platform_tag_follows 
   TABLE DATA           _   COPY public.platform_tag_follows (id, platform_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    221   �       �          0    140667    platform_writer_follows 
   TABLE DATA           e   COPY public.platform_writer_follows (id, platform_id, writer_id, created_at, updated_at) FROM stdin;
    public          postgres    false    223   ��       �          0    140487 	   platforms 
   TABLE DATA           Z   COPY public.platforms (id, display_name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    205   	�       �          0    140528 
   portfolios 
   TABLE DATA           R   COPY public.portfolios (id, writer_id, title, created_at, updated_at) FROM stdin;
    public          postgres    false    209   ��       �          0    140730    queries 
   TABLE DATA           Z   COPY public.queries (id, writer_id, platform_id, gig_id, message, created_at) FROM stdin;
    public          postgres    false    229   }�       �          0    140450    tags 
   TABLE DATA           M   COPY public.tags (id, title, is_fiction, created_at, updated_at) FROM stdin;
    public          postgres    false    201   ��       �          0    140501    users 
   TABLE DATA           �   COPY public.users (id, email, writer_id, platform_id, password, image_url, address_1, address_2, city, state, postal_code, phone, twitter_username, facebook_username, youtube_username, is_admin, created_at, updated_at, last_login_at) FROM stdin;
    public          postgres    false    207   ��       �          0    140688    writer_platform_follows 
   TABLE DATA           e   COPY public.writer_platform_follows (id, writer_id, platform_id, created_at, updated_at) FROM stdin;
    public          postgres    false    225   {�       �          0    140709    writer_tag_follows 
   TABLE DATA           [   COPY public.writer_tag_follows (id, writer_id, tag_id, created_at, updated_at) FROM stdin;
    public          postgres    false    227   ��       �          0    140464    writers 
   TABLE DATA           x   COPY public.writers (id, first_name, last_name, age, bio, expertise_1, expertise_2, created_at, updated_at) FROM stdin;
    public          postgres    false    203   B�       �           0    0    application_messages_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.application_messages_id_seq', 1, false);
          public          postgres    false    234            �           0    0    applications_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.applications_id_seq', 11, true);
          public          postgres    false    232            �           0    0    gig_tags_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.gig_tags_id_seq', 16, true);
          public          postgres    false    218            �           0    0    gigs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.gigs_id_seq', 10, true);
          public          postgres    false    212            �           0    0    ongoing_gigs_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.ongoing_gigs_id_seq', 1, false);
          public          postgres    false    230            �           0    0    piece_portfolios_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.piece_portfolios_id_seq', 21, true);
          public          postgres    false    214            �           0    0    piece_tags_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.piece_tags_id_seq', 25, true);
          public          postgres    false    216            �           0    0    pieces_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.pieces_id_seq', 21, true);
          public          postgres    false    210            �           0    0    platform_tag_follows_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.platform_tag_follows_id_seq', 15, true);
          public          postgres    false    220            �           0    0    platform_writer_follows_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.platform_writer_follows_id_seq', 10, true);
          public          postgres    false    222            �           0    0    platforms_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.platforms_id_seq', 5, true);
          public          postgres    false    204            �           0    0    portfolios_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.portfolios_id_seq', 12, true);
          public          postgres    false    208            �           0    0    queries_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.queries_id_seq', 1, false);
          public          postgres    false    228            �           0    0    tags_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.tags_id_seq', 20, true);
          public          postgres    false    200            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 10, true);
          public          postgres    false    206            �           0    0    writer_platform_follows_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.writer_platform_follows_id_seq', 9, true);
          public          postgres    false    224            �           0    0    writer_tag_follows_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.writer_tag_follows_id_seq', 7, true);
          public          postgres    false    226            �           0    0    writers_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.writers_id_seq', 5, true);
          public          postgres    false    202            �           2606    140823 .   application_messages application_messages_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_pkey;
       public            postgres    false    235            �           2606    140794    applications applications_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_pkey;
       public            postgres    false    233            �           2606    140633 #   gig_tags gig_tags_gig_id_tag_id_key 
   CONSTRAINT     h   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_gig_id_tag_id_key UNIQUE (gig_id, tag_id);
 M   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_gig_id_tag_id_key;
       public            postgres    false    219    219            �           2606    140631    gig_tags gig_tags_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_pkey;
       public            postgres    false    219            �           2606    140573    gigs gigs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.gigs
    ADD CONSTRAINT gigs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.gigs DROP CONSTRAINT gigs_pkey;
       public            postgres    false    213            �           2606    140575    gigs gigs_platform_id_title_key 
   CONSTRAINT     h   ALTER TABLE ONLY public.gigs
    ADD CONSTRAINT gigs_platform_id_title_key UNIQUE (platform_id, title);
 I   ALTER TABLE ONLY public.gigs DROP CONSTRAINT gigs_platform_id_title_key;
       public            postgres    false    213    213            �           2606    140765    ongoing_gigs ongoing_gigs_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_pkey;
       public            postgres    false    231            �           2606    140591 ;   piece_portfolios piece_portfolios_piece_id_portfolio_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_piece_id_portfolio_id_key UNIQUE (piece_id, portfolio_id);
 e   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_piece_id_portfolio_id_key;
       public            postgres    false    215    215            �           2606    140589 &   piece_portfolios piece_portfolios_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_pkey;
       public            postgres    false    215            �           2606    140612 )   piece_tags piece_tags_piece_id_tag_id_key 
   CONSTRAINT     p   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_piece_id_tag_id_key UNIQUE (piece_id, tag_id);
 S   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_piece_id_tag_id_key;
       public            postgres    false    217    217            �           2606    140610    piece_tags piece_tags_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_pkey;
       public            postgres    false    217            �           2606    140555    pieces pieces_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.pieces
    ADD CONSTRAINT pieces_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.pieces DROP CONSTRAINT pieces_pkey;
       public            postgres    false    211            �           2606    140652 .   platform_tag_follows platform_tag_follows_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_pkey;
       public            postgres    false    221            �           2606    140654 @   platform_tag_follows platform_tag_follows_platform_id_tag_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_platform_id_tag_id_key UNIQUE (platform_id, tag_id);
 j   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_platform_id_tag_id_key;
       public            postgres    false    221    221            �           2606    140673 4   platform_writer_follows platform_writer_follows_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_pkey;
       public            postgres    false    223            �           2606    140675 I   platform_writer_follows platform_writer_follows_platform_id_writer_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_platform_id_writer_id_key UNIQUE (platform_id, writer_id);
 s   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_platform_id_writer_id_key;
       public            postgres    false    223    223            �           2606    140498 $   platforms platforms_display_name_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_display_name_key UNIQUE (display_name);
 N   ALTER TABLE ONLY public.platforms DROP CONSTRAINT platforms_display_name_key;
       public            postgres    false    205            �           2606    140496    platforms platforms_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.platforms DROP CONSTRAINT platforms_pkey;
       public            postgres    false    205            �           2606    140537    portfolios portfolios_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.portfolios DROP CONSTRAINT portfolios_pkey;
       public            postgres    false    209            �           2606    140739    queries queries_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_pkey;
       public            postgres    false    229            �           2606    140741 0   queries queries_writer_id_platform_id_gig_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_writer_id_platform_id_gig_id_key UNIQUE (writer_id, platform_id, gig_id);
 Z   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_writer_id_platform_id_gig_id_key;
       public            postgres    false    229    229    229            �           2606    140459    tags tags_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
       public            postgres    false    201            �           2606    140461    tags tags_title_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_title_key UNIQUE (title);
 =   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_title_key;
       public            postgres    false    201            �           2606    140515    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    207            �           2606    140513    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    207            �           2606    140694 4   writer_platform_follows writer_platform_follows_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_pkey;
       public            postgres    false    225            �           2606    140696 I   writer_platform_follows writer_platform_follows_writer_id_platform_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_writer_id_platform_id_key UNIQUE (writer_id, platform_id);
 s   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_writer_id_platform_id_key;
       public            postgres    false    225    225            �           2606    140715 *   writer_tag_follows writer_tag_follows_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_pkey;
       public            postgres    false    227            �           2606    140717 :   writer_tag_follows writer_tag_follows_writer_id_tag_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_writer_id_tag_id_key UNIQUE (writer_id, tag_id);
 d   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_writer_id_tag_id_key;
       public            postgres    false    227    227            �           2606    140474    writers writers_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.writers
    ADD CONSTRAINT writers_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.writers DROP CONSTRAINT writers_pkey;
       public            postgres    false    203                       2606    140824 =   application_messages application_messages_application_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;
 g   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_application_id_fkey;
       public          postgres    false    235    233    3065                       2606    140844 5   application_messages application_messages_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_gig_id_fkey;
       public          postgres    false    235    213    3027                       2606    140834 :   application_messages application_messages_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_platform_id_fkey;
       public          postgres    false    235    205    3017                       2606    140839 ;   application_messages application_messages_portfolio_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;
 e   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_portfolio_id_fkey;
       public          postgres    false    235    209    3023                       2606    140829 8   application_messages application_messages_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.application_messages
    ADD CONSTRAINT application_messages_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.application_messages DROP CONSTRAINT application_messages_writer_id_fkey;
       public          postgres    false    235    203    3013                       2606    140795 %   applications applications_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_gig_id_fkey;
       public          postgres    false    3027    213    233                       2606    140805 +   applications applications_portfolio_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_portfolio_id_fkey;
       public          postgres    false    209    233    3023                       2606    140800 (   applications applications_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.applications DROP CONSTRAINT applications_writer_id_fkey;
       public          postgres    false    233    3013    203                       2606    140634    gig_tags gig_tags_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_gig_id_fkey;
       public          postgres    false    219    3027    213                       2606    140639    gig_tags gig_tags_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.gig_tags
    ADD CONSTRAINT gig_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.gig_tags DROP CONSTRAINT gig_tags_tag_id_fkey;
       public          postgres    false    3009    219    201                       2606    140576    gigs gigs_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.gigs
    ADD CONSTRAINT gigs_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.gigs DROP CONSTRAINT gigs_platform_id_fkey;
       public          postgres    false    205    213    3017                       2606    140766 %   ongoing_gigs ongoing_gigs_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_gig_id_fkey;
       public          postgres    false    3027    213    231                       2606    140776 *   ongoing_gigs ongoing_gigs_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_platform_id_fkey;
       public          postgres    false    3017    205    231                       2606    140771 (   ongoing_gigs ongoing_gigs_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ongoing_gigs
    ADD CONSTRAINT ongoing_gigs_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.ongoing_gigs DROP CONSTRAINT ongoing_gigs_writer_id_fkey;
       public          postgres    false    231    3013    203                       2606    140592 /   piece_portfolios piece_portfolios_piece_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_piece_id_fkey FOREIGN KEY (piece_id) REFERENCES public.pieces(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_piece_id_fkey;
       public          postgres    false    211    215    3025                       2606    140597 3   piece_portfolios piece_portfolios_portfolio_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_portfolios
    ADD CONSTRAINT piece_portfolios_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.piece_portfolios DROP CONSTRAINT piece_portfolios_portfolio_id_fkey;
       public          postgres    false    3023    209    215                       2606    140613 #   piece_tags piece_tags_piece_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_piece_id_fkey FOREIGN KEY (piece_id) REFERENCES public.pieces(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_piece_id_fkey;
       public          postgres    false    211    217    3025                       2606    140618 !   piece_tags piece_tags_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.piece_tags
    ADD CONSTRAINT piece_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.piece_tags DROP CONSTRAINT piece_tags_tag_id_fkey;
       public          postgres    false    217    201    3009                       2606    140556    pieces pieces_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pieces
    ADD CONSTRAINT pieces_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.pieces DROP CONSTRAINT pieces_writer_id_fkey;
       public          postgres    false    203    211    3013            	           2606    140655 :   platform_tag_follows platform_tag_follows_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_platform_id_fkey;
       public          postgres    false    3017    221    205            
           2606    140660 5   platform_tag_follows platform_tag_follows_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_tag_follows
    ADD CONSTRAINT platform_tag_follows_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.platform_tag_follows DROP CONSTRAINT platform_tag_follows_tag_id_fkey;
       public          postgres    false    3009    221    201                       2606    140676 @   platform_writer_follows platform_writer_follows_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_platform_id_fkey;
       public          postgres    false    205    223    3017                       2606    140681 >   platform_writer_follows platform_writer_follows_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.platform_writer_follows
    ADD CONSTRAINT platform_writer_follows_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.platform_writer_follows DROP CONSTRAINT platform_writer_follows_writer_id_fkey;
       public          postgres    false    3013    223    203                        2606    140538 $   portfolios portfolios_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.portfolios DROP CONSTRAINT portfolios_writer_id_fkey;
       public          postgres    false    3013    203    209                       2606    140752    queries queries_gig_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_gig_id_fkey FOREIGN KEY (gig_id) REFERENCES public.gigs(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_gig_id_fkey;
       public          postgres    false    3027    229    213                       2606    140747     queries queries_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_platform_id_fkey;
       public          postgres    false    229    3017    205                       2606    140742    queries queries_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.queries DROP CONSTRAINT queries_writer_id_fkey;
       public          postgres    false    203    229    3013            �           2606    140521    users users_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT users_platform_id_fkey;
       public          postgres    false    207    3017    205            �           2606    140516    users users_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.users DROP CONSTRAINT users_writer_id_fkey;
       public          postgres    false    203    3013    207                       2606    140702 @   writer_platform_follows writer_platform_follows_platform_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_platform_id_fkey;
       public          postgres    false    205    3017    225                       2606    140697 >   writer_platform_follows writer_platform_follows_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_platform_follows
    ADD CONSTRAINT writer_platform_follows_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.writer_platform_follows DROP CONSTRAINT writer_platform_follows_writer_id_fkey;
       public          postgres    false    203    225    3013                       2606    140723 1   writer_tag_follows writer_tag_follows_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_tag_id_fkey;
       public          postgres    false    3009    201    227                       2606    140718 4   writer_tag_follows writer_tag_follows_writer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writer_tag_follows
    ADD CONSTRAINT writer_tag_follows_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public.writers(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.writer_tag_follows DROP CONSTRAINT writer_tag_follows_writer_id_fkey;
       public          postgres    false    227    3013    203            �           2606    140475     writers writers_expertise_1_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writers
    ADD CONSTRAINT writers_expertise_1_fkey FOREIGN KEY (expertise_1) REFERENCES public.tags(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.writers DROP CONSTRAINT writers_expertise_1_fkey;
       public          postgres    false    201    203    3009            �           2606    140480     writers writers_expertise_2_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.writers
    ADD CONSTRAINT writers_expertise_2_fkey FOREIGN KEY (expertise_2) REFERENCES public.tags(id);
 J   ALTER TABLE ONLY public.writers DROP CONSTRAINT writers_expertise_2_fkey;
       public          postgres    false    203    201    3009            �      x������ � �      �   t   x����� ���c
��
8�q �����V'hñߟ&��>�v>��\�WH�1�,e!�Ҧ�kO:���� A\�Zׂ��'V?#�|U+�X}������gD�D�Nj/�)��Oep�      �   q   x�����0г;���!�����L���m%��<k;��&�\��X�x�2Ø��9]��$��M�a�~D��V[Ċ	�(�6i��jX��ٺ�u����J)�_k�      �   �  x��MS�0��ί�@2��_LÔvr�"�M����G�������-�=>9��վ��Ymʢ,�MD�#|wVQ$I�?�G�B��Xe=� 4�3���c� r$�- o>��o ��m �v������d"�J<rx�؅F�bkE�IL�O4�96h�?v<��06D��W����d$������Q�|�>$9^(8q�9�N '�9�)"�O�I��xt[4z�;�����a��! HR��!�`��$"��8�y����JtS��=�R
��N&G��y�p�R�&����CeRNd�`7��e���>��V�4D6�؎p�5�IQM�r<]�����N��"������eeuY����d9?��x�UĚ�"��%�w��G���\	�~+
z��/x���G��U�F�E����>�=ۅj��/TT�����3+���[ܳ�ͺᣵq@�/h���h���bHO.-��c���>�=�X�BN���❓}	9�ye_>��l��+����}r�Y�%}������|V�ddQ���+~�p{��&������*�����#P\0�&�+#�Z3^��	�ݾ@�p#��٤Dh@z׏��,����Dv�k��`<7��r�m�v�����ްR�+���$+�4�rŚ��pf�6yٲ��ހ��{,�\<LF��?N�]^      �      x������ � �      �   �   x����!D��PE�6��
��:24�D��A���v�vY|��'�^}E6���pi��t���&�N:��)M"y��,,i����hӊ�v�]�&UK�L����`R%vU�����{����n��K)?iy�m      �   �   x�����0�3�bH�`�'El鿎��ǧ��ASá�@|`p�:w ���6+ALOӉq1:+j1#�5Sb��,bv�MT�����Rl�2_dy)�UO['F)gj�@וI����"���tdU�60+�YF��}0�2�eԬ���gk�����      �   �  x���KO1 ���!b��u+�=��B��K.S�l2�k/^��c��^�"�D��M���|rb�6M�T��[r-�}���c���9���x7��S ly�Ѱ�Y�Gj����-D�i��p�mrR���{���5A�[����N�gr�K��s~q/����]��cH-�#�#{�Z��9��#瑞��ANB	����K2T��y�S$��$��\�A�!�N�AA�7�M�G�d
4����S!I(A���\r���<"�\F��7��y&�b�-$�!xn��*�Jɠ&�s�໎#�4Rȟ���00���k]S?���f�`��,���6���xr2��I��Q�z*ޗ���\��L��c�#�̾ �.�{^M����1uݛjo�ƕH.Y�_u�(sv㊜��O�TO�TO�TO�޹�_��k��]G��m�?�c��)?u¾gE�S=�S=�S=�{��jW慪��r�k�4�r�h�.#S?)u�Ա>�>��B��'yNGp�j]�u���jV���p�JJu�#X?�}��]�4b��j$'�S첱��}E�-��8��I�{���3�ʷ[]�>�����e�z�^��&_���`�Q�˦>�0_�h��յ�̭~��~��~�ۭ�uٔ�����Hp�z�G��2�O�E�o�3��웒M>=�g�\6s#����2��^r)[{3���7y7�m      �   p   x���A� �7��r�Q��*�������� �ǚ��^l+f}��g�o6
�ӄ0N3��	�qP�N��	4R����@.��_�BF��1~�QXd�Up��eל��xe5      �   [   x�}��� D�3T�t\c,"����G���J�`X1�C����`����A� ���'����x�T���>bWU� �]<U      �   �  x��Mn1���S� ��3��&�� �6(д@�l���J�"�nz�Ru����F#��}M�G	��a�{�^��R(��)P�Fjkp�*�FM����q: ��*yk b�Q<4�ٚ99��55��L���	"~V�sJM"���1��Y�B�ڊz�*�6�F'g�^ĕ��_���m�h;�ـ�j#�钨����&g���P.t�䩘q�q���Ƒ�cN�j%p�̐�^�R_2;h�틣�H{���8���if��w��\�=��bOʆ:�o���#x�T�m����[�w��a���f{��v0ͷ�t�{5�\ow7��x���O�7�>ȉia�O����Bo���[�-��#zy�\wR���*����S��<v.���p4�"�:�����w\��`3�,�/���Z�~�[j      �   �   x���A�0����\ ´T�W�K6�m��)e���^`�����Z��^���R�(3�-b+뢩��+�I޼5�(�
��m��Y�y&t�t��pL�;nA�'i�5O�Aωv���d-Ak���~��&�!lj�>��ל�v��.f�>��/M˱`�}�Dtr      �      x������ � �      �   �   x���1��0Ekq
.@�C�ic@1�(��K�Ԣ���Bp�������BSb�@|��6��i;x=�f�I�ZH���Jv�s !gC�8��O1�RN:y���=d�S D�b��<���#�G�&c�_�D��4B�-�O�r�@6�_V�m!���R�[����j&=��b㕎��!�M�B�����}.��6�M.Y�g�-ě��y3N�+�nEQ���E      �   �  x�͖]o�0��ͯ�E�&9����+��նJ�j��7&1���`h��焲��U�R�H�oL�y|ޣ``S5T��%m���.��O@��a���}��P�R|\\_���8g�sZ��e��n����������� �/���sS{��2:(e��e��a)��$���0gG��lvjo�U�T.]����P;�+x(����^Ե(��|�Q�#b�!_�J��8$"Ea19���'A���F�W[��TY9����h����O�b�0�HV��d�6h�*�S�������
-2�'a��F9iP]T�#kn�����I�왹u����N] �B�CK1�H	n���W1��	�q�Ᏽ\�>����6����W� �;�{�����}�Xk#4fA���^x%mc��^�P2f.����	�ͨx4�$�o�$���&l�*lA��A�w��NS�\/ �YL�qx�RY�ߪ����H�"���;�#L����"(�3�3(�`��ai;����W�z�Nr��I�b؛[�>k��� �e=Cé��*�9E�06��3��>(�QB�"S�!��:����aO�����ℶ9`�!�n�v�b�<~aD�^=�_F�m:�bGz���Z�Q��Sa`�Xd�?��W� �����:����k0l�\����N�J���4�kχ�C�)�y�<�&��C|��5k�s�/�SYɅhBjL��<ixQ�x��Z����f$      �   V   x����� C�s2E �4�!:��QX���O��Y3��q�&0c�'2�d�jG����K�?!g����<%b�N̳M'fUU� j�;�      �   Q   x���Q� ��T�������)������]�PhS�f�~Q���ӧb��a�����RbNK�3�#��?��]E�[�.�      �   �  x���n�@E��W�#����.}�@�6@��afh�ȼ27�_Nݮ�.h'i8��l��Q�{g)���5f�(�4�6���HE�\���P�T�-#YIR��=�=,l������>�e	F��*�����=r=�f������V� ^{���p�W�W�ڤ`���f��8�T%lΑ7�ԹI�>�OKIZ�L*ܫ�x2���?���*��JN^%`����rV���]K:�U�:E.�шs�RCwm/T1tA�z���?�N�[�Q3���3-���o����X=Ş�5�%�1�vb��r��O}t]��D�(sm~�0ތ���t=�8�w�p7o��i�U�O�W#<(�?X,L����y/�..�z���B�ל-���	�|<h\�5� Ӵl;�}P�3�o��ɑ3|��IüP�l�3��P�უ���f�Wy�����>û3ԟ֫��7|([     