from bluedot import BlueDot
from subprocess import call
import time
bd = BlueDot()

def repeat():
    print("Press Button to Activate Voice Input")
    bd.wait_for_press()

    call(["node", "/home/pi/google-assistant/examples/micinput.js"])

    print("Closing Mic Input")
    repeat()
repeat()