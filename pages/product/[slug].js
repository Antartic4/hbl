import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import {
  Card,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import useStyles from '../../utils/styles';
import Image from 'next/image';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/Store';

export default function ProductScreen(props) {
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  const classes = useStyles();
  const router = useRouter();

  if (!product) {
    return (
      <div>
        {router.locale === 'en'
          ? 'Product not found.'
          : 'Producto no encontrado.'}
      </div>
    );
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert(
        router.locale === 'en'
          ? 'Sorry. Product is out of stock.'
          : 'Disculpa. Se agotó el producto.'
      );
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    router.push('/cart');
  };
  const addToWishHandler = async () => {
    dispatch({
      type: 'WISH_ADD_ITEM',
      payload: { ...product, quantity: 1 },
    });
  };
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <Link href="/">
          <Typography>Devuelta a productos</Typography>
        </Link>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={642}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                {router.locale === 'en' ? 'Category' : 'Categoria'}:{' '}
                {product.category}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                {router.locale === 'en' ? 'Brand' : 'Marca'}: {product.brand}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                {router.locale === 'en' ? 'Rating' : 'Reseñas'}:{' '}
                {product.rating}{' '}
                {router.locale === 'en' ? 'stars' : 'estrellas'} (
                {product.numReviews}{' '}
                {router.locale === 'en' ? 'reviews' : 'reseñas'} )
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                {router.locale === 'en' ? 'Description' : 'Descripcion'}:{' '}
                {product.description}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      {router.locale === 'en' ? 'Price' : 'Precio'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      {router.locale === 'en' ? 'Status' : 'Estatus'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0
                        ? router.locale === 'en'
                          ? 'In Stock'
                          : 'Disponible'
                        : router.locale === 'en'
                        ? 'Unavailable'
                        : 'No Disponible'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={addToCartHandler}
                >
                  {router.locale === 'en'
                    ? 'Add to Cart'
                    : 'Agregar al carrito'}
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={addToWishHandler}
                >
                  {router.locale === 'en' ? 'Add to Wish' : 'Agregar al Wish'}
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
