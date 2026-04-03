import os
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
import yaml

@CrewBase
class VRArcCrew():
	"""VR Architecture Audit Crew"""
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	@agent
	def architecture_auditor(self) -> Agent:
		return Agent(
			config=self.agents_config['architecture_auditor'],
			verbose=True
		)

	@agent
	def structural_safety_analyst(self) -> Agent:
		return Agent(
			config=self.agents_config['structural_safety_analyst'],
			verbose=True
		)

	@agent
	def sustainability_cost_expert(self) -> Agent:
		return Agent(
			config=self.agents_config['sustainability_cost_expert'],
			verbose=True
		)

	@task
	def design_audit_task(self) -> Task:
		return Task(
			config=self.tasks_config['design_audit_task'],
			agent=self.architecture_auditor()
		)

	@task
	def safety_compliance_task(self) -> Task:
		return Task(
			config=self.tasks_config['safety_compliance_task'],
			agent=self.structural_safety_analyst()
		)

	@task
	def sustainability_report_task(self) -> Task:
		return Task(
			config=self.tasks_config['sustainability_report_task'],
			agent=self.sustainability_cost_expert()
		)

	@crew
	def crew(self) -> Crew:
		"""Creates the VR Architecture Audit crew"""
		return Crew(
			agents=self.agents, # Automatically created by the @agent decorator
			tasks=self.tasks, # Automatically created by the @task decorator
			process=Process.sequential,
			verbose=True,
			# process=Process.hierarchical, # Optional: For more complex reasoning
		)
