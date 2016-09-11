# -*- coding: utf-8 -*-
"""Python client for block-disposable-email.com service.

http://www.block-disposable-email.com/cms/help-and-usage/easy-api/
"""
try:
    # PY3
    from urllib.request import urlopen
    from urllib.error import URLError
except ImportError:
    # PY2
    from urllib2 import urlopen
    from urllib2 import URLError

import json


class BDEAResponse(object):

    """API response."""

    def __init__(self, response):
        """Initialize response."""
        self.response = response

    def is_disposable(self):
        """Return True if domain is disposable or malformed, otherwise False."""
        req_status = self.response.get('request_status', 'fail_server')

        # something went wrong, return False
        if req_status in (
                'fail_key',
                'fail_server',
                'fail_parameter_count',
                'fail_key_low_credits'):
            return False

        # invalid or nonexistent domain
        if req_status == 'fail_input_domain':
            return True

        dom_status = self.response.get('domain_status', 'ok')

        # domain is disposable
        if req_status == 'success' and dom_status == 'block':
            return True

        return False

    def status(self):
        """Return True if a request was successful, otherwise False."""
        req_status = self.response.get('request_status', 'fail_server')
        if req_status == 'success':
            return True
        return False


class BDEAStatusResponse(object):

    """API status response."""

    def __init__(self, response):
        """Initialize status response."""
        self.response = response

    def status(self):
        """Return True if status is ok and key is valid, otherwise False."""
        req_status = self.response.get('request_status', None)
        key_status = self.response.get('apikeystatus', None)
        if req_status == 'ok' and key_status == 'active':
            return True
        return False

    def credit_status(self):
        """Return credits status - good, low, exhausted."""
        return self.response.get('commercial_credit_status', 'exhausted')

    def credits(self):
        """Return amount of credits."""
        return int(self.response.get('credits', '0'))


class BDEAClient(object):

    """API client."""

    API_URL = ('http://check.block-disposable-email.com/'
               'easyapi/json/{apikey}/{domain}')
    STATUS_API_URL = ('http://status.block-disposable-email.com/'
                      'status/?apikey={apikey}')

    TEST_DOMAIN_OK = 'ok.bdea.cc'
    TEST_DOMAIN_BLOCK = 'block.bdea.cc'

    def __init__(self, apikey, timeout=5):
        """Initialize API client."""
        self.apikey = apikey
        self.timeout = timeout

    def request(self, url, timeout=None):
        """Make HTTP GET request and return parsed JSON dict or None if error."""
        timeout = timeout or self.timeout
        try:
            res = urlopen(url, timeout=timeout)
        except URLError as e:
            return {}

        try:
            body = res.read()
            if isinstance(body, bytes):
                body = body.decode('utf-8')
            return json.loads(body)
        except ValueError:
            return {}

    def get_api_status(self):
        """Check API/token status and return BDEAStatusResponse."""
        res = self.request(self.STATUS_API_URL.format(apikey=self.apikey))
        return BDEAStatusResponse(res)

    def get_domain_status(self, domain):
        """Get domain status and return BDEAResponse."""
        if '@' in domain:
            raise ValueError('Please specify domain, not email address {}'.format(domain))
        res = self.request(self.API_URL.format(apikey=self.apikey, domain=domain))
        return BDEAResponse(res)


def is_disposable_domain(domain, apikey):
    """Shortcut function to check domain disposability."""
    return BDEAClient(apikey).get_domain_status(domain).is_disposable()


def is_disposable_email(email, apikey):
    """Shortcut function to check email disposability."""
    domain = email.rsplit('@', 1)[-1]
    return BDEAClient(apikey).get_domain_status(domain).is_disposable()
