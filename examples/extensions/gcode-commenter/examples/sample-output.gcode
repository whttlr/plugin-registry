; Injected from G-Code Commenter Extension
; Generated: 2025-10-30T18:45:23.456Z
; Source: test-design.svg
G21 ; Set units to millimeters
G90 ; Absolute positioning
G0 X0 Y0 Z5 ; Move to start position (safe height)
M3 S1000 ; Start spindle at 1000 RPM
G1 Z-1 F100 ; Plunge to cutting depth
G1 X10 Y0 F500 ; Cut line
G1 X10 Y10 ; Cut line
G1 X0 Y10 ; Cut line
G1 X0 Y0 ; Complete square
G0 Z5 ; Retract to safe height
M5 ; Stop spindle
M30 ; Program end
