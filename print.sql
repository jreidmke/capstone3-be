\echo 'Delete and recreate print db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE print;
CREATE DATABASE print;
\c print; 

\i print-schema.sql
\i print-seed.sql