export const defaultCreateOfferForm = {
    "name": "Create Offer",
    "code": "create-offer",
    "fields": [
        {
            "__component": "forms.checkbox-group",
            "id": 1,
            "label": "Select Items you would like included in the sale",
            "fieldName": "itemsIncluded",
            "inputs": [
                {
                    "id": 1,
                    "label": "Stove/Range/Oven",
                    "value": null
                },
                {
                    "id": 11,
                    "label": "Refrigerators and Freezers",
                    "value": null
                },
                {
                    "id": 12,
                    "label": "Microwave",
                    "value": null
                },
                {
                    "id": 13,
                    "label": "Washer & Dryer",
                    "value": null
                },
                {
                    "id": 14,
                    "label": "Window Coverings",
                    "value": null
                },
                {
                    "id": 15,
                    "label": "Garage Door Opener(s)",
                    "value": null
                },
                {
                    "id": 16,
                    "label": "Storage Shed",
                    "value": null
                },
                {
                    "id": 17,
                    "label": "Outdoor Play Equipment",
                    "value": null
                }
            ],
            "extra": {
                "id": 2,
                "tooltip": "<p>Select or enter items that may not be attached to the property, but that you would like to be included with the sale.</p>"
            }
        },
        {
            "__component": "forms.text-input",
            "id": 2,
            "fieldName": "additionalIncludedInSale",
            "required": false,
            "label": "Additional Items",
            "tooltip": null,
            "type": "tags",
            "placeholder": null,
            "extra": null
        },
        {
            "__component": "forms.page-break",
            "id": 1,
            "always": true
        },
        {
            "__component": "forms.text-input",
            "id": 3,
            "fieldName": "amount",
            "required": true,
            "label": "How much would you like to offer?",
            "tooltip": null,
            "type": "currency",
            "placeholder": "$100,000",
            "extra": {
                "id": 3,
                "tooltip": "<p>Enter the Amount you would like to offer for the purchase of the house.</p>"
            }
        },
        {
            "__component": "forms.radio-button-group",
            "id": 1,
            "label": "Have you been pre approved for this amount?",
            "fieldName": "preApprovedForAmount",
            "radioButtons": [
                {
                    "id": 1,
                    "label": "Yes",
                    "value": "1"
                },
                {
                    "id": 2,
                    "label": "No",
                    "value": "0"
                }
            ],
            "extra": {
                "id": 8,
                "tooltip": "<p>Have you been pre-approved already? If not you will need to do so before submitting your offer. Contact a Realsy representative for more info.</p>"
            }
        },
        {
            "__component": "forms.text-input",
            "id": 4,
            "fieldName": "earnestMoneyDeposit",
            "required": false,
            "label": "Amount of Earnest Money Deposit",
            "tooltip": null,
            "type": "currency",
            "placeholder": "$50,000",
            "extra": {
                "id": 4,
                "tooltip": "<p>The earnest money deposit is used to indicate to the seller that you are really interested in buying this house. This can be any amount, but typically it's around 1-3% of the offer amount. Upon acceptance, this deposit will be attributed to your down payment. If you decide to rescind your offer however, this amount is usually not refundable.&nbsp;</p>"
            }
        },
        {
            "__component": "forms.radio-button-group",
            "id": 2,
            "label": "How are you financing the home?",
            "fieldName": "financingMethod",
            "radioButtons": [
                {
                    "id": 3,
                    "label": "All Cash (Not Financing Through a Lender)",
                    "value": null
                },
                {
                    "id": 4,
                    "label": "Conventional Loan",
                    "value": null
                },
                {
                    "id": 5,
                    "label": "Conventional Loan, with PMI",
                    "value": null
                },
                {
                    "id": 6,
                    "label": "FHA Loan",
                    "value": null
                },
                {
                    "id": 7,
                    "label": "VA Loan",
                    "value": null
                },
                {
                    "id": 8,
                    "label": "USDA",
                    "value": null
                }
            ],
            "extra": {
                "id": 9,
                "tooltip": "<p>This will be included with your pre-approval. If you're not sure where to find this, contact your lender to see what options are best for you.</p>"
            }
        },
        {
            "__component": "forms.text-input",
            "id": 5,
            "fieldName": "lenderName",
            "required": false,
            "label": "What is the name of the lender you are working with?",
            "tooltip": null,
            "type": "text",
            "placeholder": "Ex. Bank of the West",
            "extra": null
        },
        {
            "__component": "forms.text-input",
            "id": 6,
            "fieldName": "loanOfficerName",
            "required": false,
            "label": "Loan Officer Name",
            "tooltip": null,
            "type": "text",
            "placeholder": null,
            "extra": null
        },
        {
            "__component": "forms.text-input",
            "id": 7,
            "fieldName": "loanOfficerPhoneNumber",
            "required": false,
            "label": "Phone Number",
            "tooltip": null,
            "type": "phone",
            "placeholder": null,
            "extra": null
        },
        {
            "__component": "forms.text-input",
            "id": 8,
            "fieldName": "estimatedInterestRate",
            "required": false,
            "label": "Estimated Interest Rate",
            "tooltip": null,
            "type": "decimal",
            "placeholder": null,
            "extra": {
                "id": 5,
                "tooltip": "<p>This is the estimated interest rate found on your pre-approval. Sometimes this is included with your pre-approval letter, but if not you can receive this from your lender.</p>"
            }
        },
        {
            "__component": "forms.text-input",
            "id": 9,
            "fieldName": "estimatedPrincipal",
            "required": false,
            "label": "Estimated Principal & Interest",
            "tooltip": null,
            "type": "currency",
            "placeholder": "$",
            "extra": {
                "id": 6,
                "tooltip": "<p>This is the estimated dollar amount of your principal and interest monthly payments from your lender. This does not include any taxes or insurance. You can find this with your pre-approval information, or by contacting your lender.</p>"
            }
        },
        {
            "__component": "forms.page-break",
            "id": 2,
            "always": true
        },
        {
            "__component": "forms.checkbox-group",
            "id": 2,
            "label": "I would like the following inspections",
            "fieldName": "includedInspections",
            "inputs": [
                {
                    "id": 3,
                    "label": "Full Home Inspection",
                    "value": null
                },
                {
                    "id": 4,
                    "label": "Wood Infestation",
                    "value": null
                },
                {
                    "id": 5,
                    "label": "Structural",
                    "value": null
                },
                {
                    "id": 6,
                    "label": "Mold",
                    "value": null
                },
                {
                    "id": 7,
                    "label": "Septic System",
                    "value": null
                },
                {
                    "id": 8,
                    "label": "Well",
                    "value": null
                },
                {
                    "id": 9,
                    "label": "Lead Based Paint",
                    "value": null
                },
                {
                    "id": 10,
                    "label": "Radon Test",
                    "value": null
                }
            ],
            "extra": {
                "id": 10,
                "tooltip": "<p>Select the inspections you would like to be included with your purchase. &nbsp;These inspections will be added to the purchase agreement so that you're protected in case anything comes back as unsatisfactory.&nbsp;</p>"
            }
        },
        {
            "__component": "forms.text-input",
            "id": 10,
            "fieldName": "additionalInspections",
            "required": false,
            "label": "Additional Inspections",
            "tooltip": null,
            "type": "tags",
            "placeholder": "Add inspection",
            "extra": null
        },
        {
            "__component": "forms.select-input",
            "id": 1,
            "label": "How should closing costs be paid?",
            "fieldName": "closingCostsPaid",
            "options": [
                {
                    "id": 1,
                    "label": "Seller pays closing costs",
                    "value": null
                },
                {
                    "id": 2,
                    "label": "Buyer pays closing costs",
                    "value": null
                },
                {
                    "id": 3,
                    "label": "Buyer and seller split closing costs",
                    "value": null
                }
            ],
            "extra": {
                "id": 11,
                "tooltip": "<p>Closing Costs are additional fees needed to complete the purchase of your property. These fees are generally between 2-5% of the offer amount, and will be needed by your lender and title company prior to closing. &nbsp;It's normal for the buyer and seller to split these fees.</p>"
            }
        },
        {
            "__component": "forms.page-break",
            "id": 3,
            "always": true
        },
        {
            "__component": "forms.text-input",
            "id": 11,
            "fieldName": "desiredClosingDate",
            "required": false,
            "label": "When would you like to close?",
            "tooltip": null,
            "type": "date",
            "placeholder": null,
            "extra": {
                "id": 7,
                "tooltip": "<p>Typically it takes between 30-45 days to close.</p>"
            }
        },
        {
            "__component": "forms.text-input",
            "id": 12,
            "fieldName": "otherNotes",
            "required": false,
            "label": "Other notes",
            "tooltip": null,
            "type": "long_text",
            "placeholder": null,
            "extra": null
        }
    ]
}
