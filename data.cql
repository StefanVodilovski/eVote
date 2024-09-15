-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS election WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

-- Create a table
CREATE TABLE IF NOT EXISTS election.poll (
user_public_key text PRIMARY KEY,
election_name text,
duration_minutes int,
last_update_timestamp timestamp
);