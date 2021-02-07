\echo 'Delete and recreate print db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE print;
CREATE DATABASE print;
\c print; 

\i print-schema.sql
-- \i print-seed.sql

-- \echo 'Delete and recreate print_test db'
-- \prompt 'Return for yes or control-C for cancel > ' foo

-- DROP DATABASE print_test;
-- CREATE DATABASE print_test;
-- \connect print_test;

-- \i print-seed.sql