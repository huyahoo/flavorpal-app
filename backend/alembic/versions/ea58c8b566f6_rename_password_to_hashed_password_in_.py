"""rename_password_to_hashed_password_in_users_table

Revision ID: ea58c8b566f6
Revises: 79faedee8307
Create Date: 2025-05-21 13:17:38.057240

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea58c8b566f6'
down_revision: Union[str, None] = '79faedee8307'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('users', 'password', new_column_name='hashed_password', existing_type=sa.String(), nullable=False)


def downgrade() -> None:
    op.alter_column('users', 'hashed_password', new_column_name='password', existing_type=sa.String(), nullable=False)
