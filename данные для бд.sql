PGDMP                      }         
   futureauto    12.2    17.2 ?               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16384 
   futureauto    DATABASE     ~   CREATE DATABASE futureauto WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE futureauto;
                     postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                     postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                        postgres    false    7                        3079    24796    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false    7            �           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2            �            1259    24669    cars    TABLE     A  CREATE TABLE public.cars (
    id integer NOT NULL,
    brand character varying(50) NOT NULL,
    model character varying(50) NOT NULL,
    year integer NOT NULL,
    price integer NOT NULL,
    description text,
    type character varying(20),
    features jsonb,
    images jsonb,
    specs jsonb,
    body_type character varying(20),
    drive character varying(20),
    power integer,
    status character varying(20) DEFAULT 'Новый'::character varying,
    is_recommended boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.cars;
       public         heap r       postgres    false    7            �            1259    24667    cars_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.cars_id_seq;
       public               postgres    false    204    7            �           0    0    cars_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.cars_id_seq OWNED BY public.cars.id;
          public               postgres    false    203            �            1259    24835    cart    TABLE     �   CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer NOT NULL,
    car_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.cart;
       public         heap r       postgres    false    7            �            1259    24833    cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.cart_id_seq;
       public               postgres    false    208    7            �           0    0    cart_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;
          public               postgres    false    207            �            1259    24856 	   favorites    TABLE     �   CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    car_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.favorites;
       public         heap r       postgres    false    7            �            1259    24854    favorites_id_seq    SEQUENCE     �   CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.favorites_id_seq;
       public               postgres    false    210    7            �           0    0    favorites_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;
          public               postgres    false    209            �            1259    24900    feedback    TABLE     �  CREATE TABLE public.feedback (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    subject character varying(100) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'new'::character varying,
    service_type character varying(50)
);
    DROP TABLE public.feedback;
       public         heap r       postgres    false    7            �            1259    24898    feedback_id_seq    SEQUENCE     �   CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.feedback_id_seq;
       public               postgres    false    7    214            �           0    0    feedback_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;
          public               postgres    false    213            �            1259    24877    orders    TABLE     {  CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    car_id integer NOT NULL,
    car_brand character varying(50) NOT NULL,
    car_model character varying(50) NOT NULL,
    car_year integer NOT NULL,
    car_price integer NOT NULL,
    services jsonb NOT NULL,
    options jsonb NOT NULL,
    dealer character varying(100) NOT NULL,
    total_price integer NOT NULL,
    status character varying(50) DEFAULT 'Ожидает подтверждения'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    items jsonb,
    user_name character varying(100)
);
    DROP TABLE public.orders;
       public         heap r       postgres    false    7            �            1259    24875    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public               postgres    false    212    7            �           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public               postgres    false    211            �            1259    24712    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(100),
    phone character varying(20),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone,
    is_admin boolean,
    avatar_path character varying(255) DEFAULT '/images/no-image-user.jpg'::character varying
);
    DROP TABLE public.users;
       public         heap r       postgres    false    7            �            1259    24710    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    7    206            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    205            �
           2604    24672    cars id    DEFAULT     b   ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);
 6   ALTER TABLE public.cars ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    204    203    204            �
           2604    24838    cart id    DEFAULT     b   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    207    208    208            �
           2604    24859    favorites id    DEFAULT     l   ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);
 ;   ALTER TABLE public.favorites ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    209    210    210            �
           2604    24903    feedback id    DEFAULT     j   ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);
 :   ALTER TABLE public.feedback ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    213    214    214            �
           2604    24880 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    211    212    212            �
           2604    24715    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    206    205    206            r          0    24669    cars 
   TABLE DATA           �   COPY public.cars (id, brand, model, year, price, description, type, features, images, specs, body_type, drive, power, status, is_recommended, created_at) FROM stdin;
    public               postgres    false    204   |K       v          0    24835    cart 
   TABLE DATA           =   COPY public.cart (id, user_id, car_id, added_at) FROM stdin;
    public               postgres    false    208   �W       x          0    24856 	   favorites 
   TABLE DATA           B   COPY public.favorites (id, user_id, car_id, added_at) FROM stdin;
    public               postgres    false    210   BX       |          0    24900    feedback 
   TABLE DATA           n   COPY public.feedback (id, name, phone, email, subject, message, created_at, status, service_type) FROM stdin;
    public               postgres    false    214   �X       z          0    24877    orders 
   TABLE DATA           �   COPY public.orders (id, user_id, car_id, car_brand, car_model, car_year, car_price, services, options, dealer, total_price, status, created_at, items, user_name) FROM stdin;
    public               postgres    false    212   5[       t          0    24712    users 
   TABLE DATA           y   COPY public.users (id, email, password, name, phone, address, created_at, last_login, is_admin, avatar_path) FROM stdin;
    public               postgres    false    206   "]       �           0    0    cars_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.cars_id_seq', 13, true);
          public               postgres    false    203            �           0    0    cart_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.cart_id_seq', 32, true);
          public               postgres    false    207            �           0    0    favorites_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.favorites_id_seq', 6, true);
          public               postgres    false    209            �           0    0    feedback_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.feedback_id_seq', 8, true);
          public               postgres    false    213            �           0    0    orders_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.orders_id_seq', 13, true);
          public               postgres    false    211            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public               postgres    false    205            �
           2606    24679    cars cars_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cars DROP CONSTRAINT cars_pkey;
       public                 postgres    false    204            �
           2606    24841    cart cart_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public                 postgres    false    208            �
           2606    24843    cart cart_user_id_car_id_key 
   CONSTRAINT     b   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_car_id_key UNIQUE (user_id, car_id);
 F   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_user_id_car_id_key;
       public                 postgres    false    208    208            �
           2606    24862    favorites favorites_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_pkey;
       public                 postgres    false    210            �
           2606    24864 &   favorites favorites_user_id_car_id_key 
   CONSTRAINT     l   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_car_id_key UNIQUE (user_id, car_id);
 P   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_user_id_car_id_key;
       public                 postgres    false    210    210            �
           2606    24909    feedback feedback_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.feedback DROP CONSTRAINT feedback_pkey;
       public                 postgres    false    214            �
           2606    24887    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public                 postgres    false    212            �
           2606    24723    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    206            �
           2606    24721    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    206            �
           1259    24680    idx_cars_brand    INDEX     @   CREATE INDEX idx_cars_brand ON public.cars USING btree (brand);
 "   DROP INDEX public.idx_cars_brand;
       public                 postgres    false    204            �
           1259    24682    idx_cars_features    INDEX     D   CREATE INDEX idx_cars_features ON public.cars USING gin (features);
 %   DROP INDEX public.idx_cars_features;
       public                 postgres    false    204            �
           1259    24681    idx_cars_price    INDEX     @   CREATE INDEX idx_cars_price ON public.cars USING btree (price);
 "   DROP INDEX public.idx_cars_price;
       public                 postgres    false    204            �
           1259    24683    idx_cars_specs    INDEX     >   CREATE INDEX idx_cars_specs ON public.cars USING gin (specs);
 "   DROP INDEX public.idx_cars_specs;
       public                 postgres    false    204            �
           2606    24849    cart cart_car_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;
 ?   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_car_id_fkey;
       public               postgres    false    208    204    2776            �
           2606    24844    cart cart_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 @   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_user_id_fkey;
       public               postgres    false    206    208    2784            �
           2606    24870    favorites favorites_car_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_car_id_fkey;
       public               postgres    false    210    2776    204            �
           2606    24865     favorites favorites_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_user_id_fkey;
       public               postgres    false    210    206    2784            �
           2606    24893    orders orders_car_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_car_id_fkey;
       public               postgres    false    2776    204    212            �
           2606    24888    orders orders_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
       public               postgres    false    206    2784    212            r   W  x��k�[��_;���U+q�_"�*���͙���o�e/�HI(�m@�R�RJ����7m����l�������]�޵��a7U�bc����g�7�g���RÙ�|��[q� BDs�
���?�ӻ����Ϟ*����ޕ�~��������F�R���J亮����z;�	In�ޙz፹�����*Υ�ӻ�,��w�ѽ��y?��� K�<�����5~g���;sq�إ��Ź�N��>Z.�e�1�v��ڥ5Sw~�T��r�����)3YD�6�:C<gq�)c�z����i*�Q�f|;�,vkq�'��1�Yhy_�Y���Jie��j���m���|e)3��ւ�,[i���P��b��w�Ԩ�����j�@�[�r��Z-s��@�D�b1kT�4�?QD,W��r;�Z��F-¥_7�.�yj�Z��;suS˪K?K��~�߻���cu��u�=���޵мeS�f���szc��S��|�~��$�����iһ�r	��-d��,�#Hr'�,��Ȫ k��ެ����C3'z����t} �(I��X.n���/��@>p����&<���J��2d��W`����~�"�̧t"���׻Z�W������~?�[�#��jh�@9׳��PH�]h�z�����|ٻz4$��Y`R�3\-�)��riИ(:X��В�-�]������_e�����F���P��%�E0ꂯ�����l��Cw4��{Y�k�t��EkO�#�˼����e��֜�6��U��|���av��pߧ�(����*5_oW��.K�1s��v`J�`���O��Ґ�X	6,�'�����C��3����w�j�]+�ۄ9<��(��eޱZ�l���7�E|��%<[-޼�E��ըw
��q�&@���#$"���%�(�%�9�/�u��T
���ݨ���@�6�8L�O���l��WwyJv]�J63X/R�2n���Z�K'b�L
�둔X3O��6V�j����Y�2L��&�I"M��V�8��)甶*c�F0������D��i���r�]&80M�yb�J��i��w�!LHg]��I�V5B�ʋ7>-�4d�o�D�����m�i�m�Ơdz��;[�U�z���(�ƣ�'Px�\f��w
����Ne!��t�M=>�����AO�'��z ��[�`]�I�d4�0*�n�5:��ڱ���;�v*6~������a=,f+�&�n�&���5tI�$��� ��&��c��#��Gp�K�?%�jԂ�j.6:��2)�����#�����j�����m��x���W�_����|���j9���p�9�ċT�חN�ӿ|I�l6΢�|ٷ��Z�t� �F�+�e�[�:)�e�!�Z�r\�,ᕳ�#,11�UE��z>#L�S�����=XN�|�ɇ�����d�սqE�����Z�hu��hB:�h:�tzh�Ʀ#WC��Ǧ�6��ZkmK�5�"�y=s��-��	�!$��8�`s�2D-�1��`nelc��1�I�"F�1�YNŖUǬ��%�T1j��*�4V<�C%�Y�^�>�|�%��^�_Y>�ܫ΋պ�οpl�����ɗ.��\�Γ����ϜP�ZXx��{��ON��z��^Һ�=��:̒Y�E���p�oz N-g��$.�P<���<��Y��i���I5��l(�FGY*�O'rG38*
'+�0߄]
,�[0�H��`8�\[m�}�4��,�Y�M�	�L&�1�1�^{k(���;�E�Ĩ�j��K������t&�>�f��K��%U�*��#��(�_�w�e��3;���)ƕ�*$�I�x��"��<u(���֏?��!P��I�4���bP<�P����P)�x@�8������R{��z�D���/��.��r1p�t�b����e�� ��Φ̩ͭ&�`+L��qBc���q"�sLi�@)�Z�1�+��N���]lY��_��:���/ܯ_/��*���OL��َqN�']X��cl\���Y�|�c�$\С獇m�m@���B6���O�YI9��˧��lf�f{������a�>�۬��F��+,#�&��+2�U9�th汑F�7�cR����ƙ�Yަ��0�f� �!��i��M���֌�̦a%p��3�����m��f��l����!6q�o���nO~�Ǥ����KÍJ���;�)�^+��PJ��
�����X��[���бF�h��$�RK�w9b�4#�Pa��Bd���H�Ib�@�jl�҂pt�k����aO�P*�x(�g��2��(��{$��㇃�\�Ǟ�\�H�15=��\��!
p��o��&Ó�;9��O-�0��c;N�v�7�(��ӿ�@Rx�Թ�y�t��GCP�0=��/_dN
S��̀����;2�Poh��rvfck��C�;6*��FHL��
g��<�e,J�$�	+���[!��;	b�"T&{�u��� F�R�&�''B�;ޘ���y�wL8�K*UߦeL!�$��qm%Z�G͊}����ToAq��S��������e��zt� ���<]�~˅h�{�	>�1t(U�B��϶*˞��hAM�$�Eh2�<'|Z�	����.�&�y�GǺ�R8&�da���Q�s�%;Ȼ�~������@8� e���L�DS�9j-e��)��]��h�}�.*��)��Xbu�<�#퍍����T��FFD>���T�B�m4צ
}Z����#�=�%���5Ql�ٍV�)׏2�y�o��o�M������,3:���fߣ^�[,�J�v "�쓝੡�}9D�&Cy:�	�-��c��
�7Z�p����B�t|K��@:������{����m�᤻�3�J1�o���{�Y.����h��T���.Qq��Ğa�JK8��3ATˑ�n������:[��8;ǫ6VjWN��Q�o�ș�R��h�}����ᩘg���^-MB��o�z�c�pB�Jbf��@����ԏO�>VRS��i�z��y��=b﬚�xrF}���w�fȹ��tc
ʝ8�pd:��8�	8�'UC�B�
���,jۀ�3��M���>��U�ȑ#��J��      v   O   x�M̱�0�ښ�D�HɈ5K��#��_�C�`]XcFt�E�;��x|EN���R;d���cM��ˣv��f���      x   A   x�5��� �7Ta2܁�P��ב��}o�B�^�>�O�k�����_n�A6��^��c����N      |   �  x����n�@��㧘e�e����b�VH ԍ��h�ȉ[uפ�"��	UBB�' mc�毯p�8�$ �(�M<����{�6��ԣ�<��D��m۬�6Ӎz�l�Y�v�,��]Fc�P��{���r�e��ԓ]y�q�PO8�sl,duG4�t)��7���;L©nEn�P���oX�ǲ��nm�5��@�����=Nԟ<���r�t��k(7�e;���E�%��X�oǭv��%�1{�7�˗�)Jݙ<�t	��4 �f�d�hX���.�>���
����@�x�0C[���۾m��8�w�3�f@WK�s���Rv5�3�G;p{$��;��=�
���v�gT��N�;��-�2(W�a�>�S���SٙA�����U�����0taK��jג��2:���-����X3i&��݈���R1DA՛)�
��Ő
� ��Gn�i��fh�����l-␷�Z�e�[Pv''*�0hOQŝ�G9H����E�z��x���,��v:���������-�{��pK7���N#]v�[��@��	��C����s�_��jҖژ4^`��^6�WYWU���(�>���h+͢,�V��GD�v�F-J�ü�J\�_3}�?����p-���lS�4��      z   �  x��SMkQ]���GV)��}�箸p�M��"�*��Hm)ݥ�P�"�P�R�ǘHl��/���<�Mc����!0���{�9��Qd(��rc��N���s�Wn<&-�!��=h�G�x�s%��X�T,p*\ǽ�o�\�/��:(�ɑ�
�>�'n�=���hYy���q羲�3�`�-�ꧺ.`�uo���Α6h�c����Q}n����y��k%TVؼ0q��4KZYį�C����n�զ��g���ǒ��՞���k��0w����ȜG���q�o���]���rU{u������ĥ� �	Q��ѷ�����.�'���'�����f>�mҙ��1�1����{=����zyFHUhY�i�e������5Z�^}JI�oV���8[�	�Ԥj6 ˿lK���&��FOYz������6-m�X�|TS���e��1�5Ae-���Z�/2�M�Nwa%j4� �b�      t   G  x�e�Ko�@�ϛ_�C�qv�^��S!-m�MB�*Un���&Nm'mr�E�H<��WR��&�a��X'���j�1Z���P�<�m{�]�Țӱ����Ai:L�VZg9{P���������OeW�>8uYv�
;vP��:���*��(|�y|_�fp)�_�K���W�/��	���0��a�E�"Ư��	UT��G�{�6��ߒ_�_c�$����\Ib��H�I0�F�TGS��Z�p��`S��<Q,Q�T�1� ��UP�ݱ�V��z��.�Z����A��:�|�o����ۭ�F�xd���#ot���j�Y*�S.5��Y�*t�T(��j6;q������D�%q�
o���0A����� �tg�P�6~�t�8��01Yh�Vɉb*Ԥ\f�ߑk���TYe\7���X���e�'�Dg��\~~Yv��];�}�e�C��Jc-�����B�k��&'��`}G>����Q���٠�����[k��f��l"1�YT>M�&i�P X|�K)~)�D�G�YR�J�37U,��)&�LŐU�T���>��Dc̸EۓS��?/�;     