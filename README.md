# Brain-map/Mind-Hive

Mind mapping tool using AWS Amplify, React, Graphql(DynamoDB/AppSync)

https://d1v0z5tmm8db3h.cloudfront.net


## TODO
- Focus Update in place
- ~~Drop down for colour~~
- ~~Text box for Topic/description~~
- ~~Add TAG model to schema~~
- Add TAG on UPDATE and ADD Topic 
- Filter on tag, for Vista view, with + filter on things
- Multiple TAGs on TOPIC
- Limit tags to 1 word lower case
- Update link, will be an addition to add
- Delete topic, to delete the links too make sure there's a are you sure
- Delete links
- Markdown for description
- Upload Image for topic
- Cache large search
- Search
- Use for ipad
- Study mode/Edit mode
- Click on topic, redirects instead of new page
- First time users have a topic and a link
- Fix up cognito so username doesn't have to Case Sensitive
- Focus view, when adding a topic make it so the link is automatic to topic

## Use

`npm  start` will run on localhost:3000

## Notes

When publishing with cloudfront and S3 make sure to clear the cloudfront cache if you keep getting `Unauthorised`.
It takes a couple of hours to get the cloudfront site working. Don't dispare.


7/2/2020 - Finding a bug that the List functions don't list all of them but are in the dynamodb weird aye?

### Links

- graphql schemas: https://aws-amplify.github.io/docs/cli-toolchain/graphql
- React ui: https://react.semantic-ui.com
