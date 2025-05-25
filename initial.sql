CREATE TABLE public.food_kart_products (
	id serial NOT NULL,
	"name" varchar NOT NULL,
	description text NULL,
	price decimal(12, 2) NOT NULL;
	is_archived bool DEFAULT false NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT food_kart_products_pk PRIMARY KEY (id)
);
CREATE INDEX food_kart_products_name_idx ON public.food_kart_products ("name");
CREATE INDEX food_kart_products_created_at_idx ON public.food_kart_products (created_at DESC);

CREATE TYPE order_status AS ENUM ('draft', 'placed', 'confirmed', 'fulfilled', 'closed');
CREATE TABLE public.food_kart_orders (
	id uuid NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	cancelled_at timestamp NULL,
	confirmed boolean DEFAULT true NOT NULL,
	subtotal_price decimal(12, 2) NULL,
	status order_status NULL,
	fulfilled_at timestamp NULL,
	closed_at timestamp NULL,
	total_price decimal(12, 2) NULL,
	CONSTRAINT food_kart_orders_pk PRIMARY KEY (id)
);
CREATE INDEX food_kart_orders_created_at_idx ON public.food_kart_orders (created_at DESC);

CREATE TABLE public.food_kart_order_line_items (
	id serial NOT NULL,
	order_id uuid NOT NULL,
	product_id bigint NOT NULL,
	quantity int8 DEFAULT 1 NOT NULL,
	subtotal_price decimal(12, 2) DEFAULT 0 NOT NULL,
	CONSTRAINT food_kart_order_line_items_pk PRIMARY KEY (id),
	CONSTRAINT food_kart_order_line_items_unique UNIQUE (order_id,product_id),
	CONSTRAINT food_kart_order_line_items_food_kart_orders_fk FOREIGN KEY (order_id) REFERENCES public.food_kart_orders(id),
	CONSTRAINT food_kart_order_line_items_food_kart_products_fk FOREIGN KEY (product_id) REFERENCES public.food_kart_products(id)
);

CREATE TABLE public.food_kart_discounts (
	id serial NOT NULL,
	code varchar NOT NULL,
	target_type target_type not null,
	value_type value_type not null,
	discount_type discount_type not null,
	value decimal(12, 2) NULL,
	is_deleted boolean default false not null,
	CONSTRAINT food_kart_discounts_pk PRIMARY KEY (id),
	CONSTRAINT food_kart_discounts_unique UNIQUE (code, value_type)
);

CREATE TABLE public.food_kart_order_discounts (
	id serial NOT NULL,
	discount_id bigint NULL,
	order_id uuid NULL,
	CONSTRAINT food_kart_order_discounts_pk PRIMARY KEY (id),
	CONSTRAINT food_kart_order_discounts_unique UNIQUE (order_id,discount_id),
	CONSTRAINT food_kart_order_discounts_food_kart_orders_fk FOREIGN KEY (order_id) REFERENCES public.food_kart_orders(id),
	CONSTRAINT food_kart_order_discounts_food_kart_discounts_fk FOREIGN KEY (discount_id) REFERENCES public.food_kart_discounts(id)
);

