-- Phase 2: Database Consistency
-- This adds a strict foreign key to the orders table ensuring theme_id always exists in the themes table

ALTER TABLE public.orders 
ADD CONSTRAINT fk_theme 
FOREIGN KEY (theme_id) 
REFERENCES public.themes(id) 
ON DELETE RESTRICT;
