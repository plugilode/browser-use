import os
import asyncio
import streamlit as st
from browser_use import Agent
from langchain_openai import ChatOpenAI

st.title("Browser Use Demo")

api_key = st.text_input("Enter your OpenAI API Key", type="password")
task = st.text_area("Enter Task Description", placeholder="E.g., Search Reddit for 'browser-use'")

if st.button("Run Task"):
    if not api_key:
        st.error("API key is required.")
    elif not task:
        st.error("Please enter a task description.")
    else:
        os.environ["OPENAI_API_KEY"] = api_key

        async def run_task():
            agent = Agent(
                task=task,
                llm=ChatOpenAI(model="gpt-4o"),
            )
            return await agent.run()

        try:
            result = asyncio.run(run_task())
            st.write("**Result:**")
            st.write(result)
        except Exception as e:
            st.error(f"Error running task: {e}")
