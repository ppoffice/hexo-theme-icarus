# Adding an RSS feed to your hexo-icarus blog

## Installation
```
npm install hexo-generator-feed --save
```

## Configuration

```
feed:
  type: atom
  path: atom.xml
  limit: 10
```

In icarus configuration file, add your path:

```
    # URL or path to the website's RSS atom.xml
    rss: https://username.github.io/atom
```

deploy your website and get rss url we metioned above: `rss: https://username.github.io/atom`

# FeedBurner

## get FeedBurner id

Go to feedburner(feedburner.google.com) and burn your feed using the rss link: `rss: https://username.github.io/atom`

Follow the guidence and you will be prompted to activate `Email Subscription` under `Publicize`

![](https://theinsider.idxcentral.com/wp-content/uploads/2009/11/feedburner-activate.gif)

*figure from https://theinsider.idxcentral.com/wp-content/uploads/2009/11/feedburner-activate.gif*

## configure icarus file

```
    # Google FeedBurner email subscription widget configurations
    -
        # Where should the widget be placed, left sidebar or right sidebar
        position: right
        type: subscribe_email
        # Hint text under the email input
        description: 
        # Feedburner ID
        feedburner_id: 'add your feedburner id'
```

Deploy your blog again and you are all set!

People can now get email notification by subscribing your website!

