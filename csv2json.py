import csv
import json
import sys

infile = sys.stdin

fieldnames = infile.readline().rstrip()
fieldnames = fieldnames.split(",")
reader = csv.DictReader(infile, fieldnames=fieldnames)

out = []
for line in reader:
    if line == "\n" or line is None:
        break
    out.append(json.dumps(line))
print("[ {0} ]".format(",\n".join(out)))
