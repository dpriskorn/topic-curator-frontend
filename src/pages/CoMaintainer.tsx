import { Container, Card, Button } from 'react-bootstrap';
import NavbarComponent from '../components/layout/Navbar';

const CoMaintainer = () => {
    return (
        <>
            <NavbarComponent />
            <Container className="mt-5">
                <Card className="shadow-sm">
                    <Card.Body>
                        <h1>Become a Co-Maintainer</h1>
                        <p>
                            We are looking for passionate contributors to help
                            maintain and improve Wikidata Topic Curator. As a
                            co-maintainer, you will have the opportunity to
                            shape the project, fix issues, and add new features.
                        </p>
                        <h3>How to Get Involved</h3>
                        <ul>
                            <li>
                                Check out our{' '}
                                <a
                                    href="https://github.com/dpriskorn/topic-creator-frontend"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub repository
                                </a>
                            </li>
                            <li>
                                Review the{' '}
                                <a
                                    href="https://github.com/dpriskorn/topic-creator-frontend/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    open issues
                                </a>
                            </li>
                            <li>Submit pull requests with your improvements</li>
                            <li>Join discussions and share ideas</li>
                            <li>
                                Learn more about developing successful tools on{' '}
                                <a
                                    href="https://wikitech.wikimedia.org/wiki/Help:Toolforge/Developing_successful_tools"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Wikimedia Toolforge
                                </a>
                            </li>
                        </ul>
                        <Button
                            variant="primary"
                            href="https://github.com/dpriskorn/topic-creator-frontend"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contribute Now
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default CoMaintainer;
