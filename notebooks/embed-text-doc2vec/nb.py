#!/usr/bin/env python
# coding: utf-8

# # embed-text-doc2vec

# based on https://medium.com/@mishra.thedeepak/doc2vec-simple-implementation-example-df2afbbfbad5

# first, let's install some dependencies. a guide to doing this: https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/

# In[1]:


# Install a conda package in the current Jupyter kernel
import sys
get_ipython().system('conda install --yes --prefix {sys.prefix} gensim nltk')


# In[2]:


#Import all the dependencies
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize


# Let’s prepare data for training our doc2vec model

# In[5]:


data = ["I love machine learning. Its awesome.",
        "I love coding in python",
        "I love building chatbots",
        "they chat amagingly well"]


# In[8]:


tagged_data = [TaggedDocument(words=word_tokenize(_d.lower()), 
    tags=[str(i)]) for i, _d in enumerate(data)]


# Here we have a list of four sentences as training data. Now I have tagged the data and its ready for training. Lets start training our model.

# In[9]:


max_epochs = 100
vec_size = 20
alpha = 0.025
model = Doc2Vec(size=vec_size,
                alpha=alpha,
                min_alpha=0.00025,
                min_count=1,
                dm=1)


# In[11]:


model.build_vocab(tagged_data)


# In[12]:


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

# In[13]:


from gensim.models.doc2vec import Doc2Vec

model= Doc2Vec.load("d2v.model")

#to find the vector of a document which is not in the training data
test_data = word_tokenize("I love chatbots".lower())
v1 = model.infer_vector(test_data)
print("V1_infer", v1)



# In[14]:


# to find most similar doc using tags
similar_doc = model.docvecs.most_similar('1')
print(similar_doc)


# In[15]:


# to find vector of doc in training data using tags
# or in other words printing the vector of the document 
# at index 1 in the training data
print(model.docvecs['1'])


# In[ ]:




