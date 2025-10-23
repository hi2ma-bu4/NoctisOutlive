from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Click the "Volcanic Peak" stage button
        page.mouse.click(960, 500)  # Approximate coordinates for the button
        page.wait_for_timeout(1000) # Wait for scene transition

        page.screenshot(path="jules-scratch/verification/volcanic-peak-fixed.png")
        browser.close()

run()
