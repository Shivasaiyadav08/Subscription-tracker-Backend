import {Subscription} from '../models/subscriptionmodel.js'
import { workflowClient } from '../config/uptash.js'
import { SERVER_URL } from '../config/env.js'

export const CreateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      //Spreads the properties from the incoming request body (req.body) into the new subscription object.
      ...req.body,
      //A middleware function verifies the user's identity using a token (e.g., JWT).
      //Once the token is validated, the middleware fetches the user's data from the database using the userId decoded from the token.
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/sub/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscription= async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}