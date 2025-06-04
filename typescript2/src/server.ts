import express from "express";
import Project from "./Project";
import Stripe from 'stripe';
import cors from "cors";


let app = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe("");

(async() => {
    /*
    let users = await Project.database.getUsers();

    for(let i = 0;  i < users.length; i++) {
        let currentUser = users[i];

        console.log(currentUser.id, currentUser.email.toLowerCase(), currentUser.password);
    }
    */

    let sendWelcomeEmail = (email:string) => {
        console.log("Sending email to " + email);
    }

    interface TaskrunnerFunction<T = any> {
        (type:string, data:T):Promise<any>
    }

    interface TaskFunctions {
        [key:string]:TaskrunnerFunction
    }

    let taskFunctions:TaskFunctions = {};

    let addTask = async(type:string, data:any) => {
        let result = await Project.database.connection.execute("INSERT INTO background_tasks (type, data) VALUES ('" + type + "', '" + JSON.stringify(data) + "')");
        console.log(result);
    }

    let sendInvitation:TaskrunnerFunction = async(type:string, data:any) => {
        sendWelcomeEmail(data.email);
        await addTask("updateBookkeeping", {});
    }
    taskFunctions["sendInvitation"] = sendInvitation;

    taskFunctions["test"] = async(type:string, data:any) => {
        console.log("Task function: " + type);
    };

    let implementFunction:TaskrunnerFunction = async(type:string, data:any) => {
        console.log("Implement this type: " + type);
    };

    taskFunctions["updateBookkeeping"] = implementFunction;
    taskFunctions["somethingElse"] = implementFunction;

    
    await addTask("sendInvitation", {"email": "mattias@example.com"});
    

    setInterval(async() => {
        //console.log("Timer");

        let result = await Project.database.connection.execute("SELECT * FROM background_tasks WHERE status = 0");

        let tasks = result[0] as any[];
        for(let i = 0; i < tasks.length; i++) {
            let task = tasks[i];

            let id:number = task.id;
            console.log(id);
            let type:string = task.type;
            let isOk = true;

            if(taskFunctions[type]) {
                let data = JSON.parse(task.data);
                await taskFunctions[type](type, data);
            }
            else {
                console.warn("No type named " + type);
                isOk = false;
            }

            if(isOk) {
                await Project.database.connection.execute("UPDATE background_tasks SET status = 1 WHERE id = " + id);
            }
            else {
                await Project.database.connection.execute("UPDATE background_tasks SET status = 2 WHERE id = " + id);
            }
        }
        
    }, 1*1000);

    app.get("/", async(req, res) => {
        res.send("Hello");
        await addTask("sendInvitation", {"email": "mattias@example.com"});
    });

    app.post('/create-payment-intent', async (req, res) => {
        let amount = 3000;
        let currency = "SEK";
      
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            setup_future_usage: "off_session",
            automatic_payment_methods: { enabled: true }, // enables Stripe Elements with automatic payment method detection
          });
      
          res.send({
            clientSecret: paymentIntent.client_secret,
          });
        } catch (err) {
          console.error(err);
          res.status(500).send({ error: 'Failed to create payment intent' });
        }
      });

      app.get("/attach-customer-to-payment", async(req, res) => {
        let result = await stripe.customers.create({
            email: "mattias@developedbyme.com",
            payment_method: "pm_1RWE1pIKI9fa0AK2M1H9LJco"
        });

        //Spara subscriptopn, customer och payment till database
        //Starts cron-job för subscription

        res.send(result);
      })

    app.get("/renew-payment", async(req, res) => {
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 5000,
            currency: "SEK",
            confirm: true,
            off_session: true,
            payment_method: "pm_1RWE1pIKI9fa0AK2M1H9LJco",
            customer: "cus_SR6FbCSy3bZEMo"
        });

        res.send(paymentIntent);
    });

    app.get("/create-checkout-session", async(req, res) => {

        const session = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            line_items: [
              {
                price: 'price_1RWBmsIKI9fa0AK2DVvyN4GS',
                quantity: 1,
              },
            ],
            mode: 'subscription',
          });

        res.send(session);
    });

    app.get("/verify-checkout-session", async(req, res) => {

        let session = await stripe.checkout.sessions.retrieve("cs_test_a1ypfTNxg8FX2wageyABZUmiv00POdElWCqpOLxyi48Yt0RhU1CpHaQpek");

        let subscriptionId = session.subscription;

        if(session.status === "complete") {
            //Spara subscription id i databasen
        }

        res.send(session);
    });

    app.get("/test-failed-payment", async(req, res) => {
        let body = {
            id: 'evt_1RWCteIKI9fa0AK2ujjxRugA',
            object: 'event',
            api_version: '2022-08-01',
            created: 1749026526,
            data: {
              object: {
                id: 'in_1RWCtWIKI9fa0AK2GHfhiZVG',
                object: 'invoice',
                account_country: 'SE',
                account_name: 'Developed by me AB',
                account_tax_ids: null,
                amount_due: 2000,
                amount_overpaid: 0,
                amount_paid: 0,
                amount_remaining: 2000,
                amount_shipping: 0,
                application: null,
                application_fee_amount: null,
                attempt_count: 1,
                attempted: true,
                auto_advance: true,
                automatic_tax: {},
                automatically_finalizes_at: null,
                billing_reason: 'subscription_cycle',
                charge: 'ch_3RWCtaIKI9fa0AK20p1amaKJ',
                collection_method: 'charge_automatically',
                created: 1750839810,
                currency: 'sek',
                custom_fields: null,
                customer: 'cus_SR4l0O0Xv15AKB',
                customer_address: {},
                customer_email: 'mattias@developedbyme.com',
                customer_name: '3434',
                customer_phone: null,
                customer_shipping: null,
                customer_tax_exempt: 'none',
                customer_tax_ids: [],
                default_payment_method: null,
                default_source: null,
                default_tax_rates: [],
                description: null,
                discount: null,
                discounts: [],
                due_date: null,
                effective_at: 1750843410,
                ending_balance: 0,
                footer: null,
                from_invoice: null,
                hosted_invoice_url: 'https://invoice.stripe.com/i/acct_1BzWc3IKI9fa0AK2/test_YWNjdF8xQnpXYzNJS0k5ZmEwQUsyLF9TUjUzQVh0eHh1TTNmbVE4QXpWR0toMzZ0RkFDSTlQLDEzOTU2NzMyNg0200lp1SwVcT?s=ap',
                invoice_pdf: 'https://pay.stripe.com/invoice/acct_1BzWc3IKI9fa0AK2/test_YWNjdF8xQnpXYzNJS0k5ZmEwQUsyLF9TUjUzQVh0eHh1TTNmbVE4QXpWR0toMzZ0RkFDSTlQLDEzOTU2NzMyNg0200lp1SwVcT/pdf?s=ap',
                issuer: {},
                last_finalization_error: null,
                latest_revision: null,
                lines: {},
                livemode: false,
                metadata: {},
                next_payment_attempt: 1751307380,
                number: 'TO8X49TZ-0004',
                on_behalf_of: null,
                paid: false,
                paid_out_of_band: false,
                parent: {},
                payment_intent: 'pi_3RWCtaIKI9fa0AK20ZyOisyj',
                payment_settings: {},
                period_end: 1750839810,
                period_start: 1750235010,
                post_payment_credit_notes_amount: 0,
                pre_payment_credit_notes_amount: 0,
                quote: null,
                receipt_number: null,
                rendering: null,
                rendering_options: null,
                shipping_cost: null,
                shipping_details: null,
                starting_balance: 0,
                statement_descriptor: null,
                status: 'open',
                status_transitions: {},
                subscription: 'sub_1RWCbfIKI9fa0AK2AdZm3Ozl',
                subscription_details: {},
                subtotal: 2000,
                subtotal_excluding_tax: 2000,
                tax: null,
                test_clock: 'clock_1RWCkoIKI9fa0AK2kANECltt',
                total: 2000,
                total_discount_amounts: [],
                total_excluding_tax: 2000,
                total_pretax_credit_amounts: [],
                total_tax_amounts: [],
                total_taxes: [],
                transfer_data: null,
                webhooks_delivered_at: 1750839810
              }
            },
            livemode: false,
            pending_webhooks: 2,
            request: { id: null, idempotency_key: null },
            type: 'invoice.payment_failed'
          }
          
          console.log("subsrciption id", body.data.object.subscription);
          console.log("invoice id", body.data.object.id);
          console.log("hosted_invoice_url", body.data.object.hosted_invoice_url);

          res.send({});
    })

    app.post("/stripe-webhook", async(req, res) => {
        console.log(req.body);

        let type = req.body.type;
        switch(type) {
            case "checkout.session.completed":
                //Do something
                break;
            case "invoice.payment_failed":
                //Hämta subscription id
                //Markera subscription som ej betald
                //Hämta invoice id
                //Hämta betallänk
                break;
            case "invoice.payment_succeeded":
                //Hämta subscription id
                //Kolla om status på subscrion är active
                //Uppdatera egna databasen med att subscrion är aktiv
                break;
        }

        res.send({});
    })
    
    //app.use(Project.routes.auth);
    //app.use(Project.routes.products);
    
    app.listen(3000, () => {
        console.log("Server started");
    });
})();