import os
from pathlib import Path

from crewai import Agent, Crew, LLM, Process, Task
from crewai.project import CrewBase, agent, crew, task
from dotenv import load_dotenv


# Load env reliably when imported from nested package folders.
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")


def _build_llm():
    """
    Create an LLM config for CrewAI.
    Priority: Gemini (GOOGLE_API_KEY) -> OpenAI (OPENAI_API_KEY)
    """
    google_key = os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if google_key:
        return LLM(
            # CrewAI expects provider/model format for Gemini API.
            model=os.getenv("CREWAI_GEMINI_MODEL", "gemini/gemini-2.5-flash"),
            api_key=google_key,
            temperature=0.2,
        )

    if openai_key:
        return LLM(
            model=os.getenv("CREWAI_OPENAI_MODEL", "openai/gpt-4o-mini"),
            api_key=openai_key,
            temperature=0.2,
        )

    raise RuntimeError("Missing API Key in environment (set GOOGLE_API_KEY or OPENAI_API_KEY).")


@CrewBase
class VRArcCrew:
    """VR Architecture Audit Crew."""

    agents_config = "../config/agents.yaml"
    tasks_config = "../config/tasks.yaml"

    @agent
    def architecture_auditor(self) -> Agent:
        return Agent(
            config=self.agents_config["architecture_auditor"],
            llm=_build_llm(),
            verbose=False,
        )

    @agent
    def structural_safety_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["structural_safety_analyst"],
            llm=_build_llm(),
            verbose=False,
        )

    @agent
    def sustainability_cost_expert(self) -> Agent:
        return Agent(
            config=self.agents_config["sustainability_cost_expert"],
            llm=_build_llm(),
            verbose=False,
        )

    @task
    def design_audit_task(self) -> Task:
        return Task(
            config=self.tasks_config["design_audit_task"],
            agent=self.architecture_auditor(),
        )

    @task
    def safety_compliance_task(self) -> Task:
        return Task(
            config=self.tasks_config["safety_compliance_task"],
            agent=self.structural_safety_analyst(),
        )

    @task
    def sustainability_report_task(self) -> Task:
        return Task(
            config=self.tasks_config["sustainability_report_task"],
            agent=self.sustainability_cost_expert(),
        )

    @crew
    def crew(self) -> Crew:
        """Create the VR Architecture Audit crew."""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,
        )

