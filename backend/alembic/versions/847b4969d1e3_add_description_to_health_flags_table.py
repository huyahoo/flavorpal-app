"""add_description_to_health_flags_table

Revision ID: 847b4969d1e3
Revises: ea58c8b566f6
Create Date: 2025-05-22 01:15:12.224705

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '847b4969d1e3'
down_revision: Union[str, None] = 'ea58c8b566f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('health_flags', sa.Column('description', sa.String(), nullable=False, server_default="Default description"))


def downgrade() -> None:
    op.drop_column('health_flags', 'description')
