

# **Technical Documentation: Setting Up SSL with Certbot on Nginx and Resolving DNS Issues**

## **Overview**

This document outlines the process of securing an Nginx server with SSL certificates using Certbot, as well as troubleshooting a common DNS issue related to the "NXDOMAIN" error encountered when trying to authenticate a domain. It will provide a step-by-step guide and solutions to ensure successful SSL installation and domain verification.

---

## **Prerequisites**
Before proceeding with the steps to install SSL, ensure you have:

1. An **Ubuntu** server running with **Nginx** installed.
2. Your domain (e.g., `johndesiventures.site`) pointing to the correct IP address of your AWS EC2 instance.
3. **Certbot** installed along with the Nginx plugin on your server.

If any of these are missing, please refer to the appropriate guides for installation.

---

## **Step 1: Install Certbot and Nginx Plugin**
To secure your Nginx server with SSL, you need Certbot and its Nginx plugin. Install these tools by running the following commands:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

---

## **Step 2: Request an SSL Certificate Using Certbot**

Once Certbot is installed, you can use it to request an SSL certificate for your domain. Run the following command, replacing `yourdomain.com` with your actual domain:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

This command:
- Requests a certificate for both `yourdomain.com` and `www.yourdomain.com`.
- Automatically configures Nginx to serve the SSL certificate.

---

## **Step 3: Common DNS Issue - NXDOMAIN Error**

### **Error Message**
Certbot may fail to authenticate the domains during the SSL request with the following error:

```
Certbot failed to authenticate some domains (authenticator: nginx). The Certificate Authority reported these problems:
  Domain: www.johndesiventures.site
  Type:   dns
  Detail: DNS problem: NXDOMAIN looking up A for www.johndesiventures.site - check that a DNS record exists for this domain; DNS problem: NXDOMAIN looking up AAAA for www.johndesiventures.site - check that a DNS record exists for this domain
```

### **Cause of the Error**
The error `NXDOMAIN looking up A` indicates that DNS records for the domain `www.johndesiventures.site` are not set up properly. The DNS lookup for the domain failed because there was no valid A or AAAA record pointing to the server’s IP address. This happens when:

1. The **A record** for `www.johndesiventures.site` is missing.
2. The **CNAME record** for `www.johndesiventures.site` is not pointing to the root domain or the correct IP address.

### **Solution**

To resolve the error, follow these steps to configure the correct DNS records in Namecheap:

---

### **Step 4: Configure DNS Records on Namecheap**

1. **Log in to Namecheap**:
   Go to the [Namecheap website](https://www.namecheap.com/) and log in to your account.

2. **Go to Domain List**:
   From the **"Domain List"** section, select the domain (`johndesiventures.site`) and click on **Manage**.

3. **Navigate to Advanced DNS**:
   In the domain management page, click on the **"Advanced DNS"** tab.

4. **Add CNAME Record**:
   - Scroll down to the **"Host Records"** section.
   - Click **"Add New Record"** and choose **CNAME Record** from the dropdown.
   - **Host**: Enter `www` (this corresponds to the subdomain `www`).
   - **Value**: Enter `@` or the root domain (e.g., `johndesiventures.site`).

   **Example Configuration**:
   - **Host**: `www`
   - **Value**: `johndesiventures.site` (or `@` for the root domain)

5. **Save Changes**:
   After adding the CNAME record, click **"Save All Changes"**.

---

### **Step 5: Verify DNS Propagation**

DNS changes can take anywhere from a few minutes to several hours to propagate. You can verify that your DNS records are set correctly by using a DNS checking tool such as [DNS Checker](https://dnschecker.org/).

Check that both:
- `yourdomain.com` points to your AWS instance IP address.
- `www.yourdomain.com` points to the same IP (via the CNAME record).

Once propagation is complete, Certbot should be able to authenticate the domains.

---

### **Step 6: Retry SSL Certificate Request**

Once DNS records are updated and propagated, try requesting the SSL certificate again with Certbot:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot should now authenticate both domains successfully and install the SSL certificate.

---

## **Step 7: Automatic SSL Certificate Renewal**

Certbot automatically sets up a renewal process. To check the renewal process, run:

```bash
sudo certbot renew --dry-run
```

This simulates the renewal process and ensures that everything will work correctly when it’s time to renew the certificate.

---

## **Conclusion**

By following these steps, you should be able to secure your Nginx server with SSL certificates using Certbot. If you encounter the `NXDOMAIN` error, it's usually related to missing or misconfigured DNS records. Updating the DNS settings to include a CNAME record for `www` and ensuring the domain points to the correct IP should resolve the issue.
