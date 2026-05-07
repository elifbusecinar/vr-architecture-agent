import asyncio
from pathlib import Path

from fastmcp import Client


async def run_mcp_client(verbose: bool = False) -> dict:
    server_path = Path(__file__).with_name("server.py")
    client = Client(str(server_path))

    if verbose:
        print("=== MCP Client Run Started ===")
        print(f"Server: {server_path.name}\n")

    async with client:
        if verbose:
            print("1) Connected to MCP server")

        tools = await client.list_tools()
        tool_list = [{"name": tool.name, "description": tool.description} for tool in tools]
        if verbose:
            print("2) Tools discovered via MCP:")
            for tool in tool_list:
                print(f"   - {tool['name']}: {tool['description']}")

        if verbose:
            print("\n3) Calling tool: estimate_project_risk")
        risk_result = await client.call_tool(
            "estimate_project_risk",
            {"seismic_zone": 3, "floors": 12, "sustainability_score": 55},
        )
        risk_text = getattr(risk_result, "data", str(risk_result))
        if verbose:
            print("   Result:")
            print(risk_text)

        risk_level_line = next(
            (line for line in risk_text.splitlines() if line.startswith("Risk Level:")),
            "Risk Level: MEDIUM",
        )
        risk_level = risk_level_line.split(":", 1)[1].strip()

        if verbose:
            print("\n4) Calling tool: suggest_next_action")
        action_result = await client.call_tool(
            "suggest_next_action", {"risk_level": risk_level}
        )
        action_text = getattr(action_result, "data", str(action_result))
        if verbose:
            print("   Result:")
            print(action_text)

    if verbose:
        print("\n=== MCP Client Run Completed ===")

    return {
        "server": server_path.name,
        "tools": tool_list,
        "risk_result": risk_text,
        "risk_level": risk_level,
        "action_result": action_text,
    }


async def main() -> None:
    await run_mcp_client(verbose=True)


if __name__ == "__main__":
    asyncio.run(main())

