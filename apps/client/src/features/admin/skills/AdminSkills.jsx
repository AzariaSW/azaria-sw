import { useState } from "react";

import useSkills from "../../../features/skills/hooks/useSkills";
import useSkillCategories from "../../../features/skills/hooks/useSkillCategories";
import useDeleteSkill from "../../../features/skills/hooks/useDeleteSkill";

import { Button, Card } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";

import SkillForm from "./components/SkillForm/SkillForm";

import "./AdminSkills.css";

export default function AdminSkills() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    data: skillsData,
    isLoading: skillsLoading,
    isError: skillsError,
  } = useSkills();

  const { data: categories, isLoading: categoriesLoading } =
    useSkillCategories();

  const deleteSkill = useDeleteSkill();

  const skills = skillsData?.items ?? [];
  const skillCategories = categories ?? [];

  function handleCreate() {
    setEditingSkill(null);
    setIsFormOpen(true);
  }

  function handleEdit(skill) {
    setEditingSkill(skill);
    setIsFormOpen(true);

    setTimeout(() => {
      document.querySelector(".skill-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleDelete(skill) {
    const confirmed = window.confirm(
      `Delete "${skill.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteSkill.mutate(skill.id);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingSkill(null);
  }

  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  if (skillsLoading || categoriesLoading) {
    return (
      <main className="admin-skills">
        <Skeleton />
      </main>
    );
  }

  if (skillsError) {
    return (
      <main className="admin-skills">
        <p className="failed">Failed to load skills.</p>
      </main>
    );
  }

  const filteredSkills = selectedCategory
    ? skills.filter((skill) => skill.category === selectedCategory)
    : skills;

  return (
    <main className="admin-skills">
      <header className="admin-skills__header">
        <div>
          <h1>Skills</h1>

          <p>Manage the skills displayed on your public portfolio.</p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Add Skill
        </Button>
      </header>

      {isFormOpen && (
        <SkillForm skill={editingSkill} onClose={handleFormClose} />
      )}

      <div className="admin-skills__toolbar">
        <label className="admin-skills__filter" htmlFor="skill-category">
          <span>Category</span>

          <select
            id="skill-category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All categories</option>

            {skillCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <span className="admin-skills__count">
          {filteredSkills.length}{" "}
          {filteredSkills.length === 1 ? "skill" : "skills"}
        </span>
      </div>

      <section className="admin-skills__list">
        {filteredSkills.length === 0 ? (
          <Card>
            <div className="admin-skills__empty">
              <p>
                {selectedCategory
                  ? "No skills found in this category."
                  : "No skills have been added yet."}
              </p>

              {!selectedCategory && (
                <Button type="button" onClick={handleCreate}>
                  Add Your First Skill
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredSkills.map((skill) => (
            <Card key={skill.id}>
              <article className="admin-skills__card">
                <div className="admin-skills__info">
                  <div className="admin-skills__title">
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt=""
                        className="admin-skills__icon"
                      />
                    )}

                    <h2>{skill.name}</h2>
                  </div>

                  <div className="admin-skills__meta">
                    <span>{skill.category}</span>

                    <span>{skill.level}</span>
                  </div>
                </div>

                <div className="admin-skills__actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEdit(skill)}
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    disabled={deleteSkill.isPending}
                    onClick={() => handleDelete(skill)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
