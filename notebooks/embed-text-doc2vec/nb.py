#!/usr/bin/env python
# coding: utf-8

# # embed-text-doc2vec

# based on https://medium.com/@mishra.thedeepak/doc2vec-simple-implementation-example-df2afbbfbad5

# first, let's install some dependencies. a guide to doing this: https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/

# In[24]:


# Install a conda package in the current Jupyter kernel
import sys
get_ipython().system('conda install --yes --prefix {sys.prefix} gensim nltk')


# In[25]:


#Import all the dependencies
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize


# Let’s prepare data for training our doc2vec model

# In[26]:


data_dir = '../../data/'

# our list of documents
data = []


# In[27]:


import glob
txt_files = glob.glob(f"{data_dir}/*.txt")
print(len(txt_files))


# In[28]:


# should an example of just the filename without the path
txt_files[0][11:]


# In[29]:


for file in txt_files:
    with open(file, 'r', encoding="utf-8") as file:
        currentText = file.read()
        data.append(currentText)
        file.close()

print(len(data))


# In[30]:


from random import randrange
random_index = randrange(len(data)-1)

# print the first 1000 characters of a random document from our corpus
print(data[random_index][0:1000])


# In[7]:


tagged_data = [TaggedDocument(words=word_tokenize(_d.lower()), 
    tags=[str(i)]) for i, _d in enumerate(data)]


# Here we have a list of four sentences as training data. Now I have tagged the data and its ready for training. Lets start training our model.

# In[8]:


max_epochs = 100
vec_size = 20
alpha = 0.025
model = Doc2Vec(size=vec_size,
                alpha=alpha,
                min_alpha=0.00025,
                min_count=1,
                dm=1)


# In[9]:


model.build_vocab(tagged_data)


# In[10]:


for epoch in range(max_epochs):
    print ('iteration {0}'.format(epoch))
    model.train(tagged_data,
                total_examples=model.corpus_count,
                epochs=model.iter)
    # decrease the learning rate
    model.alpha -= 0.002
    # fix the learning rate, no decay
    model.min_alpha = model.alpha
    
model.save("d2v.model")
print("Model d2v.model Saved")


# Note: dm defines the training algorithm. If dm=1 means ‘distributed memory’ (PV-DM) and dm =0 means ‘distributed bag of words’ (PV-DBOW). Distributed Memory model preserves the word order in a document whereas Distributed Bag of words just uses the bag of words approach, which doesn’t preserve any word order.
# 
# So we have saved the model and it’s ready for implementation. Lets play with it.

# In[31]:


from gensim.models.doc2vec import Doc2Vec

model= Doc2Vec.load("d2v.model")

#to find the vector of a document which is not in the training data
test_data = word_tokenize("I love chatbots".lower())
v1 = model.infer_vector(test_data)
print("V1_infer", v1)



# In[32]:


# to find most similar doc using tags
similar_doc = model.docvecs.most_similar('1')
print(similar_doc)


# In[33]:


# to find vector of doc in training data using tags
# or in other words printing the vector of the document 
# at index 1 in the training data
print(model.docvecs['1'])


# In[34]:


# how many dimensions does our doc2vec document space have?
dimensions = len(model.docvecs['1'])
print(dimensions)


# Cool! This dimensionality is determined by the `vec_size` parameter we specified at training time.

# In[35]:


# create column headers for csv file
headers = ['doc']
i = 0
while i < dimensions:
    headers.append(f"v{i}")
    i+=1
    
print(headers)


# In[36]:


# retrieve vectors of all documents in training data
# write vectors to a csv file
import csv

with open('document-vectors.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"')
    writer.writerow(headers)
    
    index_count = len(data)-1
    i = 0
    while i <= index_count:
        doc_name = txt_files[i][11:]
        vec = list(model.docvecs[i])
        row = [doc_name] + vec
        writer.writerow(row)
        i += 1


# In[37]:


# read vectors in from csv file
import csv

imported_vectors = []

with open('document-vectors.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    for row in reader:
        imported_vectors.append(row)
        
print(imported_vectors[0:2])


# In[38]:


# project from 20D to 2D with t-SNE
from __future__ import print_function
import time
import numpy as np
import pandas as pd
from sklearn.datasets import fetch_openml
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
get_ipython().run_line_magic('matplotlib', 'inline')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import seaborn as sns


# In[39]:


model.docvecs


# In[40]:


df = pd.DataFrame(list(model.docvecs))

def stripPath(file):
    return file[11:]

# list(map(stripPath, txt_files))
df['y'] = list(range(0,len(list(model.docvecs))))
df['label'] = df['y'].apply(lambda i: str(i))

# X, y = None, None

print('Size of the dataframe: {}'.format(df.shape))


# In[41]:


# For reproducibility of the results
np.random.seed(42)

rndperm = np.random.permutation(df.shape[0])


# In[42]:


time_start = time.time()
tsne = TSNE(n_components=2, verbose=1, perplexity=40, n_iter=300)
tsne_results = tsne.fit_transform(df)
print('t-SNE done! Time elapsed: {} seconds'.format(time.time()-time_start))


# In[44]:


# visualize t-SNE projection
results = pd.DataFrame()

results['tsne-2d-one'] = tsne_results[:,0]
results['tsne-2d-two'] = tsne_results[:,1]

plt.figure(figsize=(16,10))
sns.scatterplot(
    x="tsne-2d-one", y="tsne-2d-two",
    hue="y",
    palette=sns.color_palette("hls", 10),
    data=results,
    legend="full",
    alpha=0.3
)

# plt.figure(figsize=(16,10))
# sns.lmplot(
#     x="tsne-2d-one", y="tsne-2d-two",
#     hue="y",
#     palette=sns.color_palette("hls", 10),
#     data=results,
#     legend="full",
#     alpha=0.3,
#     fit_reg=False,
#     scatter_kws={"marker": "D", # Set marker style
#                            "s": 100} # S marker size
# )


# In[38]:


# project from 20D to 2D with UMAP


# In[33]:


# visualize UMAP projection

