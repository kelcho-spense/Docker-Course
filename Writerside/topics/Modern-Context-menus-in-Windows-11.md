# Restore the old Context Menu in Windows 11

1. Right-click the Start button and choose Windows Terminal.
2. Copy the command from below, paste it into Windows Terminal Window, and press enter.
3. ```bash 
    reg.exe add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
   ```
4. Restart File Explorer or your computer for the changes to take effect.
5. You would see the Legacy Right Click Context menu by default.

## Restore Modern Context menus in Windows 11
- To undo this change, in a Terminal Window, execute this command:
    ```bash
    reg.exe delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f
    ```