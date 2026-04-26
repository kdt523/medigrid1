import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


def main():
    conn = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="optusyes523",
        host="localhost",
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname='medigrid_db'")
    exists = cur.fetchone()
    if not exists:
        cur.execute("CREATE DATABASE medigrid_db")
        print("Created database medigrid_db")
    else:
        print("Database medigrid_db already exists")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
