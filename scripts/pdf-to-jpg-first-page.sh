#!/bin/bash 
infile=${1}
outfile=${2}
dpi=${3}

# gs -q -o $(basename "${infile}")_p%04d.jpeg -sDEVICE=jpeg -dFirstPage=1 -dLastPage=1 "${infile}"

# To get thumbnail JPEGs with a width 200 pixel use the following command:
# gs -q -o name_200px_p%04d.jpg -sDEVICE=jpeg -dPDFFitPage -g200x400 -dFirstPage=1 -dLastPage=1 "${infile}"

# To get higher quality JPEGs (but also bigger-in-size ones) with a 
# resolution of ${dpi} dpi use the following command:
gs -q -o "${outfile}" -sDEVICE=jpeg -dJPEGQ=100 -r600 -dFirstPage=1 -dLastPage=1 "${infile}" # -r"${dpi}"

echo "wrote ${outfile}"

# source
# https://stackoverflow.com/questions/11828528/display-first-page-of-pdf-as-image