# MCS Python Library: Usage README

## Download

### Python Library

1. Install the required third-party Python libraries:

```
pip install -r requirements.txt
```

2. Ensure you've installed `ai2thor` version `2.2.0`:

```
pip show ai2thor
```

3. Install the MCS Python Library:

```
pip install git+https://github.com/NextCenturyCorporation/MCS@latest
```

### Unity Application

Please note that our Unity App is built on Linux. If you need a Mac or Windows version, please [contact us](#troubleshooting) directly.

1. [Download the Latest MCS Unity App](https://github.com/NextCenturyCorporation/MCS/releases/download/0.0.1/MCS-AI2-THOR-Unity-App-v0.0.1.x86_64)

2. [Download the Latest MCS Unity Data Directory TAR](https://github.com/NextCenturyCorporation/MCS/releases/download/0.0.1/MCS-AI2-THOR-Unity-App-v0.0.1_Data.tar.gz)

3. Ensure that both the Unity App and the TAR are in the same directory.

4. Untar the Data Directory:

```
tar -xzvf MCS-AI2-THOR-Unity-App-v0.0.1_Data.tar.gz
```

5. Mark the Unity App as executable:

```
chmod a+x MCS-AI2-THOR-Unity-App-v0.0.1.x86_64
```

## Import

Code Example:

```python
from machine_common_sense import MCS

# Either load the config data dict from an MCS config JSON file or create your own.
# We will give you the training config JSON files and the format to make your own.
config_data = MCS.load_config_json_file(config_json_file_path)

# We will give you the Unity app file.
controller = MCS.create_controller(unity_app_file_path)

output = controller.start_scene(config_data)

# Use your machine learning algorithm to select your next action based on the scene
# output (goal, actions, images, metadata, etc.) from your previous action.
action, params = select_action(output)

# Continue to select actions until your algorithm decides to stop.
while action != '':
  controller.step(action, params)
    action, params = select_action(output)

# For interaction-based goals, your series of selected actions will be scored.
# For observation-based goals, you will pass a classification and a confidence
# to the end_scene function here.
controller.end_scene()
```

## Run with Human Input

To start the Unity application and enter your actions and parameters from the terminal, you can run the `mcs_run_in_human_input_mode` script that was installed in the package with the MCS Python Library:

```
mcs_run_in_human_input_mode <mcs_unity_build_file> <mcs_config_json_file>
```

If you want the script to save the input and output data in a new folder named after the scene, add `true` to the end of the above console command.

## Documentation

[API.md](./API.md)

## Example Scene Configuration Files

[scenes/README.md](./scenes/README.md)

## Development README

[machine_common_sense/README.md](./machine_common_sense/README.md)

## Troubleshooting

[mcs-ta2@machinecommonsense.com](mailto:mcs-ta2@machinecommonsense.com)

