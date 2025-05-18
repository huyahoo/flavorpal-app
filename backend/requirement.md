请基于 SQLAlchemy 2.0 ORM 写出以下数据库模型，并为 Alembic 迁移做好准备。

要求：
- 使用 `Declarative Base` 定义模型类
- 添加外键和关联关系（如 OneToMany、ManyToMany）
- 使用 `datetime` 处理时间字段
- 所有模型放在 backend/app/models 目录下的单独文件中（如 user.py, product.py）
- 多对多关联表可单独用 Table 定义

表结构如下：

User:
- id (PK)
- name (String)
- email (String, unique)
- password (String)
- created_at (Datetime)
- updated_at (Datetime)

Product:
- id (PK)
- name (String)
- barcode (String, unique)
- image_url (String)
- last_updated (Datetime)
- generic_name (String)
- ingredients (Text)
- categories (String)
- brands (String)

Review:
- id (PK)
- user_id (FK → User.id)
- product_id (FK → Product.id)
- rating (Integer)
- note (Text)
- created_at (Datetime)
- updated_at (Datetime)
- likes_count (Integer)

History:
- id (PK)
- user_id (FK → User.id)
- product_id (FK → Product.id)
- scanned_at (Datetime)

Badge:
- id (PK)
- name (String)
- description (Text)

User_Badge:
- user_id (FK → User.id)
- badge_id (FK → Badge.id)
- earned_at (Datetime)

Health_Flag:
- id (PK)
- name (String)

User_Health_Flag:
- user_id (FK → User.id)
- health_flag_id (FK → Health_Flag.id)