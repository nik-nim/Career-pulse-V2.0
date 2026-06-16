import uuid
from sqlalchemy import String, Float, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class UserSkill(Base):
    __tablename__ = "user_skills"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    skill_name: Mapped[str] = mapped_column(String(100), nullable=False)
    proficiency: Mapped[float] = mapped_column(Float, default=0.5)
    endorsements: Mapped[int] = mapped_column(Integer, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    user = relationship("User", back_populates="skills")