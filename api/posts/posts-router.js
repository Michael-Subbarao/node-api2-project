// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');
const router = express.Router();
// | N | Method | Endpoint                | Description                                                                                                                     |
// | - | ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database                                                          |
// | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**                                                                               |
// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**                                                  |
// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id            


router.get('/', (req, res) => {
    Posts.find(req.query)
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "There was an error while saving the post to the database" });
      });
  });

  router.get('/:id', (req, res) => {
    let id = Number(req.params.id);
    if(Number.isNaN(id)) {
      res.status(400).json({message: 'invalid id'});
      return;
    }
    Posts.findById(req.params.id)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the post' });
      });
  });
  router.get('/:id/comments', (req, res) => {
    Posts.find(req.query.id)
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "There was an error while saving the post to the database" });
      });
  });

  router.post('/', (req, res) => {
    if(!(req.body.title && req.body.contents)){
        res.status(400).json({ message: "Please provide title and contents for the post" });
    }
    else{
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the post' });
      });
    }
  });
  router.put('/:id', (req, res) => {
    const changes = req.body;
    Posts.update(req.params.id, changes)
      .then(post => {
        if(!(changes.title && changes.contents)){
            res.status(400).json({ message: "Please provide title and contents for the post" });
        }
        else if (post) {
          res.status(200).json(post);
        } 
        else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "The post information could not be modified" });
      });
  });
  router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: 'The adopter has been nuked' });
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "The post could not be removed" });
      });
  });
module.exports = router;