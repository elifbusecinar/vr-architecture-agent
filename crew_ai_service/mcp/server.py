from fastmcp import FastMCP


mcp = FastMCP("vr-architecture-mcp-tools")


@mcp.tool()
def estimate_project_risk(
    seismic_zone: int,
    floors: int,
    sustainability_score: int,
) -> str:
    """Estimate design risk level from simple project inputs."""
    risk_points = 0

    if seismic_zone >= 3:
        risk_points += 2
    if floors >= 10:
        risk_points += 2
    if sustainability_score < 60:
        risk_points += 1

    if risk_points <= 1:
        level = "LOW"
    elif risk_points <= 3:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return (
        f"Risk Level: {level}\n"
        f"- Seismic Zone: {seismic_zone}\n"
        f"- Floors: {floors}\n"
        f"- Sustainability Score: {sustainability_score}\n"
        f"- Risk Points: {risk_points}"
    )


@mcp.tool()
def suggest_next_action(risk_level: str) -> str:
    """Suggest one practical next step based on risk level."""
    normalized = risk_level.strip().upper()
    if normalized == "HIGH":
        return "Run full structural simulation and hold design review this week."
    if normalized == "MEDIUM":
        return "Prioritize stair/fire-safety checks and update cost assumptions."
    return "Proceed to client presentation with a lightweight compliance checklist."


if __name__ == "__main__":
    mcp.run()

