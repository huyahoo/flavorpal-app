"""remove_description_from_health_flags

Revision ID: 06c64a7244ca
Revises: 847b4969d1e3
Create Date: 2025-05-22 04:46:29.831759

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '06c64a7244ca'
down_revision: Union[str, None] = '847b4969d1e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('health_flags', 'description')


def downgrade() -> None:
    op.add_column('health_flags', 
                  sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=False, server_default='Default description')
                 )
